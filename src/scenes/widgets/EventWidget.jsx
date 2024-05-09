import React, { useEffect, useState, useRef } from "react";
import { useDispatch } from "react-redux";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import CancelIcon from '@mui/icons-material/Cancel';
import SendIcon from '@mui/icons-material/Send';
import { Box, Button, Typography, Rating, IconButton, TextField, MenuItem, Select } from "@mui/material";
import { Chart, LinearScale, CategoryScale ,registerables} from 'chart.js';
Chart.register(...registerables); // register all the components

const hashString = (str) => {
  if (typeof str !== 'string' || str === undefined) {
    return 0; // or any other appropriate value
  }

  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }

  return hash;
};
  

// Définition des traductions pour différentes langues
const translations = {
  en: {
    participate: "Participate",
    participating: "Participation in progress...",
    participated: "Already participated",
    addComment: "Add comment",
    delete: "Delete",
    edit: "Edit",
    cancel: "Cancel",
    save: "Save",
    comments: "Comments",
    evaluation: "Rating",
  },
  fr: {
    participate: "Participer",
    participating: "Participation en cours...",
    participated: "Déjà participé",
    addComment: "Ajouter un commentaire",
    delete: "Supprimer",
    edit: "Modifier",
    cancel: "Annuler",
    save: "Enregistrer",
    comments: "Commentaires",
    evaluation: "Évaluation",
  },
};

const EventWidget = ({ userId, title, dateDebut }) => {
  const [language, setLanguage] = useState("en"); // État pour stocker la langue sélectionnée
  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };
  const [isParticipating, setIsParticipating] = useState(false);
  const [participantCount, setParticipantCount] = useState(() => {
    const storedCount = localStorage.getItem(`event_${hashString(title)}_participants`);
    return storedCount ? parseInt(storedCount) : 0;
  });
  const [alreadyParticipated, setAlreadyParticipated] = useState(false);
  const [comments, setComments] = useState(() => {
    const storedComments = localStorage.getItem(`event_${hashString(title)}_comments`);
    return storedComments ? JSON.parse(storedComments) : [];
  });
  const [newComment, setNewComment] = useState("");
  const [rating, setRating] = useState(() => {
    const storedRating = localStorage.getItem(`event_${hashString(title)}_rating`);
    return storedRating ? parseInt(storedRating) : 0;
  });
  const [editCommentId, setEditCommentId] = useState(null);
  const [editCommentText, setEditCommentText] = useState("");

  // Références aux éléments canvas pour les graphiques
  const participationChartRef = useRef();
  const commentChartRef = useRef();

  const eventParticipantKey = `event_${hashString(title)}_participants`;
  const eventCommentsKey = `event_${hashString(title)}_comments`;
  const eventRatingKey = `event_${hashString(title)}_rating`;

  const dispatch = useDispatch();

  const handleParticipate = async () => {
    if (isParticipating || alreadyParticipated) {
      return;
    }

    setIsParticipating(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log("Successfully participated in event:", title);

      const newCount = participantCount + 1;
      setParticipantCount(newCount);
      setAlreadyParticipated(true);

      localStorage.setItem(eventParticipantKey, newCount.toString());
    } catch (error) {
      console.error("Failed to participate in event:", error);
    } finally {
      setIsParticipating(false);
    }
  };

  const handleCommentChange = (event) => {
    setNewComment(event.target.value);
  };

  const addComment = () => {
    if (newComment.trim() === "") {
      return;
    }
    const updatedComments = [...comments, { id: Date.now(), content: newComment, authorId: userId }]; 
    setComments(updatedComments);
    localStorage.setItem(eventCommentsKey, JSON.stringify(updatedComments));
    setNewComment("");

    // Émettre un événement pour notifier les autres onglets/utilisateurs
    localStorage.setItem('commentUpdated', Date.now().toString());
  };

  const deleteComment = (commentId) => {
    const commentToDelete = comments.find(comment => comment.id === commentId);
    
    if (commentToDelete && commentToDelete.authorId === userId) {
      const updatedComments = comments.filter(comment => comment.id !== commentId);
      setComments(updatedComments);
      localStorage.setItem(eventCommentsKey, JSON.stringify(updatedComments));
  
      // Émettre un événement pour notifier les autres onglets/utilisateurs
      localStorage.setItem('commentUpdated', Date.now().toString());
    }
  };

  const startEditComment = (commentId, content, authorId) => {
    if (authorId === userId) {
      setEditCommentId(commentId);
      setEditCommentText(content);
    } else {
      // Afficher un message d'erreur ou prendre une autre action appropriée pour informer l'utilisateur qu'il ne peut pas modifier ce commentaire
      console.log("Vous n'êtes pas autorisé à modifier ce commentaire.");
    }
  };

  const cancelEditComment = () => {
    setEditCommentId(null);
    setEditCommentText("");
  };

  const saveEditComment = () => {
    const commentToEdit = comments.find(comment => comment.id === editCommentId);
    if (commentToEdit && commentToEdit.authorId === userId) {
      const updatedComments = comments.map(comment => {
        if (comment.id === editCommentId) {
          return { ...comment, content: editCommentText };
        }
        return comment;
      });
      setComments(updatedComments);
      localStorage.setItem(eventCommentsKey, JSON.stringify(updatedComments));
      setEditCommentId(null);
      setEditCommentText("");
  
      // Émettre un événement pour notifier les autres onglets/utilisateurs
      localStorage.setItem('commentUpdated', Date.now().toString());
    } else {
      console.log("Vous n'êtes pas autorisé à modifier ce commentaire.");
    }
  };

  const addRating = (value) => {
    setRating(value);
    localStorage.setItem(eventRatingKey, value.toString());
  };

  useEffect(() => {
    const storedComments = localStorage.getItem(eventCommentsKey);
    if (storedComments) {
      setComments(JSON.parse(storedComments));
    }
  }, [eventCommentsKey]);

  // Écouter l'événement de mise à jour des commentaires
  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === 'commentUpdated') {
        // Mettre à jour les données des commentaires dans cet onglet/utilisateur
        const updatedComments = JSON.parse(localStorage.getItem(eventCommentsKey));
        setComments(updatedComments);
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [eventCommentsKey]);

  useEffect(() => {
    // Création du graphique de participation
    const participationChartCanvas = participationChartRef.current;
    const participationChart = new Chart(participationChartCanvas, {
      type: 'bar',
      data: {
        labels: ['Participated', 'Not Participated'],
        datasets: [{
          label: 'Participation Statistics',
          data: [participantCount, 100 - participantCount],
          backgroundColor: [
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 99, 132, 0.2)',
          ],
          borderColor: [
            'rgba(54, 162, 235, 1)',
            'rgba(255, 99, 132, 1)',
          ],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  
    // Création du graphique de commentaires
    const commentChartCanvas = commentChartRef.current;
    const commentChart = new Chart(commentChartCanvas, {
      type: 'doughnut',
      data: {
        labels: ['Comments', 'No Comments'],
        datasets: [{
          label: 'Comments Statistics',
          data: [comments.length, 100 - comments.length],
          backgroundColor: [
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
          ],
          borderColor: [
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
          ],
          borderWidth: 1
        }]
      }
    });
  
    return () => {
      if (participationChart) {
        participationChart.destroy();
      }
      if (commentChart) {
        commentChart.destroy();
      }
    };
  }, [participantCount, comments.length]);
  

  // Fonction pour traduire les textes en fonction de la langue sélectionnée
  const translate = (key) => {
    return translations[language][key];
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
      <Typography sx={{ color: "text.secondary", marginBottom: "0.5rem" }}>{translate('participants')}: {participantCount}</Typography>
      <Button 
        variant="contained" 
        onClick={handleParticipate} 
        disabled={isParticipating || alreadyParticipated} 
        sx={{ 
          backgroundColor: alreadyParticipated ? "#9e9e9e" : "#4caf50", 
          color: "white",
          "&:hover": {
            backgroundColor: alreadyParticipated ? "#9e9e9e" : "#388e3c", 
          },
        }}
      >
        {alreadyParticipated ? translate('participated') : (isParticipating ? translate('participating') : translate('participate'))}
      </Button>
  
      <Box mt={2} width="100%">
        <Typography variant="h6" mb={1}>{translate('comments')} :</Typography>
        <Box width="100%" display="flex" flexDirection="column" alignItems="center">
          <TextField 
            multiline
            value={newComment} 
            onChange={handleCommentChange} 
            placeholder={translate('addComment')} 
            variant="outlined"
            sx={{ width: "100%", marginBottom: "0.5rem" }}
          />
          <Button variant="contained" onClick={addComment} style={{ width: "100%", marginBottom: "0.5rem" }}>{translate('addComment')}</Button>
          <Box width="100%" display="flex" flexDirection="column" alignItems="center">
            {comments.map((comment) => (
              <Box key={comment.id} style={{ width: "100%", marginBottom: "0.5rem", padding: "0.5rem", border: "1px solid #ccc", borderRadius: "8px", position: "relative", display: "flex" }}>
                {editCommentId === comment.id ? (
                  <>
                    <TextField 
                      multiline
                      value={editCommentText} 
                      onChange={(e) => setEditCommentText(e.target.value)} 
                      variant="outlined"
                      sx={{ width: "100%", marginBottom: "0.5rem" }}
                    />
                    <IconButton onClick={saveEditComment} sx={{ position: "absolute", top: "5px", right: "5px" }}><CheckIcon /></IconButton>
                    <IconButton onClick={cancelEditComment} sx={{ position: "absolute", top: "5px", right: "40px" }}><CancelIcon /></IconButton>
                  </>
                ) : (
                  <>
                    <Typography>{comment.content}</Typography>
                    {comment.authorId === userId && (
                      <>
                        <IconButton aria-label="edit" onClick={() => startEditComment(comment.id, comment.content, comment.authorId)} style={{ marginLeft: "auto" }}>
                          <EditIcon />
                        </IconButton>
                        <IconButton aria-label="delete" onClick={() => deleteComment(comment.id)}>
                          <DeleteIcon />
                        </IconButton>
                      </>
                    )}
                  </>
                )}
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
  
      <Box mt={2} width="100%">
        <Typography variant="h6" mb={1}>{translate('evaluation')} :</Typography>
        <Rating
          value={rating}
          precision={0.5}
          onChange={(event, newValue) => {
            addRating(newValue);
          }}
        />
      </Box>
  
      {/* Statistiques */}
      <div style={{ width: "50%" }}>
        <canvas ref={participationChartRef}></canvas>
      </div>
      <div style={{ width: "50%" }}>
        <canvas ref={commentChartRef}></canvas>
      </div>
  
      {/* Sélecteur de langue */}
      <Select value={language} onChange={handleLanguageChange} sx={{ marginTop: '1rem' }}>
        <MenuItem value="en">English</MenuItem>
        <MenuItem value="fr">Français</MenuItem>
      </Select>
    </Box>
  );
  
};
export default EventWidget;
