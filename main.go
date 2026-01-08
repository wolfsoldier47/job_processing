package main

import (
	"community_project/database"
	"community_project/handlers"
	"community_project/middleware"
	"log"
	"net/http"

	"github.com/gorilla/mux"
)

func main() {
	database.InitDB()

	r := mux.NewRouter()

	api := r.PathPrefix("/api").Subrouter()
	api.HandleFunc("/register", handlers.Register).Methods("POST")
	api.HandleFunc("/login", handlers.Login).Methods("POST")

	api2 := r.PathPrefix("/api").Subrouter()
	api2.Use(middleware.AuthMiddleware)
	api2.HandleFunc("/profile", handlers.Profile).Methods("GET")
	api2.HandleFunc("/job", handlers.LongRunningJob).Methods("POST")
	api2.HandleFunc("/job/{id}", handlers.GetJobStatus).Methods("GET")
	api2.HandleFunc("/jobs", handlers.GetJobs).Methods("GET")
	api2.HandleFunc("/logout", handlers.Logout).Methods("POST")
	api2.HandleFunc("/joblogs/{id}", handlers.GetlogsOfaJob).Methods("GET")

	log.Println("Server started on :8080")
	log.Fatal(http.ListenAndServe(":8080", r))
}
