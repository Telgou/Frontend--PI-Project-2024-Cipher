import { Box, Button, Typography } from "@mui/material";
import { useState, useEffect } from "react";

const EventWidget = ({
  postId,
  title,
  dateDebut,
}) => {
  const [isParticipating, setIsParticipating] = useState(false);
  const [participantCount, setParticipantCount] = useState(() => {
    // Récupérer le nombre de participants depuis le localStorage
    const storedCount = localStorage.getItem(`event_${postId}_participants`);
    return storedCount ? parseInt(storedCount) : 0;
  });
  const [alreadyParticipated, setAlreadyParticipated] = useState(false);

  const handleParticipate = async () => {
    // Empêcher les clics répétés pendant le chargement
    if (isParticipating || alreadyParticipated) {
      return;
    }

    // Mettre à jour l'état pour afficher le chargement
    setIsParticipating(true);

    try {
      // Simuler une participation à l'événement en attendant 1 seconde
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log("Successfully participated in event:", title);

      // Incrémenter le nombre de participants
      const newCount = participantCount + 1;
      setParticipantCount(newCount);

      // Marquer l'utilisateur comme ayant déjà participé à cet événement
      setAlreadyParticipated(true);

      // Sauvegarder le nouveau nombre de participants dans le localStorage
      localStorage.setItem(`event_${postId}_participants`, newCount.toString());
    } catch (error) {
      // Gérer les erreurs en cas d'échec de la participation
      console.error("Failed to participate in event:", error);
    } finally {
      // Réinitialiser l'état après la fin de la requête
      setIsParticipating(false);
    }
  };

  useEffect(() => {
    // Vérifier si l'utilisateur a déjà participé à cet événement
    const storedCount = localStorage.getItem(`event_${postId}_participants`);
    if (storedCount) {
      setAlreadyParticipated(true);
    }

    // Nettoyer le localStorage lorsque le composant est démonté
    return () => {
      localStorage.removeItem(`event_${postId}_participants`);
    };
  }, [postId]);

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
      <Typography sx={{ color: "text.secondary", marginBottom: "0.5rem" }}>Nombre de participants: {participantCount}</Typography>
      <Button 
        variant="contained" 
        onClick={handleParticipate} 
        disabled={isParticipating || alreadyParticipated} // Désactiver le bouton pendant le chargement ou si l'utilisateur a déjà participé
        sx={{ 
          backgroundColor: alreadyParticipated ? "#9e9e9e" : "#4caf50", // Changer la couleur du bouton si l'utilisateur a déjà participé
          color: "white",
          "&:hover": {
            backgroundColor: alreadyParticipated ? "#9e9e9e" : "#388e3c", // Changer la couleur au survol si l'utilisateur a déjà participé
          },
        }}
      >
        {alreadyParticipated ? "Already participated" : (isParticipating ? "Participation en cours..." : "Participer")}
      </Button>
    </Box>
  );
};

export default EventWidget;
