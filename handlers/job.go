package handlers

import (
	"community_project/database"
	"crypto/rand"
	"database/sql"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/gorilla/mux"
)

type JobStatus string

const (
	JobRunning   JobStatus = "Running"
	JobCompleted JobStatus = "Completed"
)

type Job struct {
	ID        string    `json:"id"`
	Status    JobStatus `json:"status"`
	Logs      []string  `json:"logs"`
	CreatedAt time.Time `json:"created_at"`
	Username  string    `json:"username"`
}

// GenerateID creates a random hex string for job IDs
func GenerateID() string {
	bytes := make([]byte, 8)
	rand.Read(bytes)
	return hex.EncodeToString(bytes)
}

// Helper to update job in DB
func updateJobInDB(job *Job) {
	logsJson, _ := json.Marshal(job.Logs)
	_, err := database.DB.Exec("UPDATE jobs SET status = ?, logs = ? WHERE id = ?", job.Status, string(logsJson), job.ID)
	if err != nil {
		log.Printf("Error updating job %s: %v", job.ID, err)
	}
}

func timer(job *Job) {
	timeLeft := 20

	for i := 0; i < 2; i++ {
		time.Sleep(5 * time.Second)
		timeLeft -= 5

		logMsg := fmt.Sprintf("Job is running... current time remaining: %d", timeLeft)

		// Append log and save to DB
		job.Logs = append(job.Logs, logMsg)
		updateJobInDB(job)
	}
}

func LongRunningJob(w http.ResponseWriter, r *http.Request) {
	// Get username from session
	session, _ := Store.Get(r, "session-name")
	username, ok := session.Values["username"].(string)
	if !ok {
		// Should be handled by middleware by now, but just in case
		username = "Unknown"
	}

	jobID := GenerateID()
	job := &Job{
		ID:       jobID,
		Status:   JobRunning,
		Logs:     []string{"Job started..."},
		Username: username,
	}

	// Insert into DB
	logsJson, _ := json.Marshal(job.Logs)
	_, err := database.DB.Exec("INSERT INTO jobs (id, status, logs, username) VALUES (?, ?, ?, ?)", job.ID, job.Status, string(logsJson), job.Username)
	if err != nil {
		http.Error(w, "Failed to start job", http.StatusInternalServerError)
		return
	}

	// Launch async job
	go func(j *Job) {
		timer(j)

		j.Status = JobCompleted
		j.Logs = append(j.Logs, "Job completed.")
		updateJobInDB(j)
	}(job)

	w.WriteHeader(http.StatusAccepted)
	json.NewEncoder(w).Encode(map[string]string{
		"job_id":  jobID,
		"message": "Job started",
	})
}

func GetJobStatus(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	jobID := vars["id"]

	var job Job
	var logsString string
	var statusString string

	row := database.DB.QueryRow("SELECT id, status, logs FROM jobs WHERE id = ?", jobID)
	err := row.Scan(&job.ID, &statusString, &logsString)
	if err == sql.ErrNoRows {
		http.Error(w, "Job not found", http.StatusNotFound)
		return
	} else if err != nil {
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}

	job.Status = JobStatus(statusString)
	json.Unmarshal([]byte(logsString), &job.Logs)

	json.NewEncoder(w).Encode(job)
}

func GetJobs(w http.ResponseWriter, r *http.Request) {
	page := 1
	limit := 10

	// Parse query params
	if p := r.URL.Query().Get("page"); p != "" {
		fmt.Sscanf(p, "%d", &page)
	}
	if l := r.URL.Query().Get("limit"); l != "" {
		fmt.Sscanf(l, "%d", &limit)
	}

	if page < 1 {
		page = 1
	}
	offset := (page - 1) * limit

	// Query total count (all jobs)
	var total int
	err := database.DB.QueryRow("SELECT COUNT(*) FROM jobs").Scan(&total)
	if err != nil {
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}

	// Query jobs (all jobs)
	rows, err := database.DB.Query("SELECT id, status, logs, created_at, COALESCE(username, 'Unknown') FROM jobs ORDER BY created_at DESC LIMIT ? OFFSET ?", limit, offset)
	if err != nil {
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var jobs []Job
	for rows.Next() {
		var job Job
		var logsString string

		if err := rows.Scan(&job.ID, &job.Status, &logsString, &job.CreatedAt, &job.Username); err != nil {
			continue
		}
		json.Unmarshal([]byte(logsString), &job.Logs)
		jobs = append(jobs, job)
	}

	json.NewEncoder(w).Encode(map[string]interface{}{
		"jobs":  jobs,
		"total": total,
		"page":  page,
		"limit": limit,
	})
}

func GetlogsOfaJob(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	jobID := vars["id"]

	var job Job
	var logsString string

	row := database.DB.QueryRow("SELECT id, status, logs FROM jobs WHERE id = ?", jobID)
	err := row.Scan(&job.ID, &job.Status, &logsString)
	if err == sql.ErrNoRows {
		http.Error(w, "Job not found", http.StatusNotFound)
		return
	} else if err != nil {
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}

	json.Unmarshal([]byte(logsString), &job.Logs)
	json.NewEncoder(w).Encode(job)
}
