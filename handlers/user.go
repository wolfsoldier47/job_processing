package handlers

import (
	"encoding/json"
	"net/http"
)

func Profile(w http.ResponseWriter, r *http.Request) {
	session, _ := Store.Get(r, "session-name")

	// Check if user is authenticated
	if auth, ok := session.Values["authenticated"].(bool); !ok || !auth {
		http.Error(w, "Forbidden", http.StatusForbidden)
		return
	}

	username := session.Values["username"].(string)

	response := map[string]string{
		"message":  "Welcome to your profile",
		"username": username,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}
