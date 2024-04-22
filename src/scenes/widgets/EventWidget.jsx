import { Box, Button, Typography } from "@mui/material";
import { useState } from "react";

const EventWidget = ({
  postId,
  title,
  dateDebut,
}) => {
  const [isParticipating, setIsParticipating] = useState(false);

  const handleParticipate = async () => {
    // Empêcher les clics répétés pendant le chargement
    if (isParticipating) {
      return;
    }

    // Mettre à jour l'état pour afficher le chargement
    setIsParticipating(true);

    try {
      // Simuler une participation à l'événement en attendant 1 seconde
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log("Successfully participated in event:", postId);
    } catch (error) {
      // Gérer les erreurs en cas d'échec de la participation
      console.error("Failed to participate in event:", error);
    } finally {
      // Réinitialiser l'état après la fin de la requête
      setIsParticipating(false);
    }
  };

  return (
    <Box sx={{ 
      border: "1px solid #e0e0e0",
      borderRadius: "8px",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      p: "1rem",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      textAlign: "center",
    }}>
      <img 
        src="../assets/Esprit.jpeg" 
        alt="twitter" 
        style={{ 
          maxWidth: "100%",
          height: "auto",
          marginBottom: "0.5rem",
          borderRadius: "8px",
        }} 
      />
      <Typography variant="h5" sx={{ fontWeight: 600, marginBottom: "0.5rem" }}>
        {title}
      </Typography>
      <Typography sx={{ color: "text.secondary", marginBottom: "0.5rem" }}>{dateDebut}</Typography>
      <Button 
        variant="contained" 
        onClick={handleParticipate} 
        disabled={isParticipating} // Désactiver le bouton pendant le chargement
        sx={{ 
          backgroundColor: "#4caf50",
          color: "white",
          "&:hover": {
            backgroundColor: "#388e3c",
          },
        }}
      >
        {isParticipating ? "Participation en cours..." : "Participer"}
      </Button>
    </Box>
  );
};

export default EventWidget;
