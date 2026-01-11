package handlers

import (
	"encoding/json"
	"net/http"
)

func Profile(w http.ResponseWriter, r *http.Request) {
	// Extract username from context (set by middleware)
	username, ok := r.Context().Value("username").(string)
	if !ok {
		http.Error(w, "Forbidden", http.StatusForbidden)
		return
	}

	response := map[string]string{
		"message":  "Welcome to your profile",
		"username": username,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}
