// Gestion du formulaire de contact avec envoi WhatsApp
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            sendToWhatsApp();
        });
    }
    
    // Ajouter la validation en temps réel
    setupRealTimeValidation();
});

// Fonction pour envoyer le message via WhatsApp
function sendToWhatsApp() {
    const name = document.getElementById('contactName').value;
    const email = document.getElementById('contactEmail').value;
    const subject = document.getElementById('contactSubject').value;
    const message = document.getElementById('contactMessage').value;
    
    // Valider les champs
    if (!name || !email || !subject || !message) {
        showContactError('Veuillez remplir tous les champs obligatoires.');
        return;
    }
    
    // Valider l'email
    if (!isValidEmail(email)) {
        showContactError('Veuillez entrer une adresse email valide.');
        return;
    }
    
    // Afficher l'indicateur de chargement
    const submitBtn = document.querySelector('#contactForm button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Préparation...';
    submitBtn.disabled = true;
    
    // Préparer le message pour WhatsApp
    const whatsappMessage = `📧 NOUVEAU MESSAGE
    
👤 *Nom:* ${name}
📧 *Email:* ${email}
📋 *Sujet:* ${subject}

💬 *Message:*
${message}

---
Envoyé depuis Full collection - ${new Date().toLocaleString('fr-FR')}`;

    // Numéro WhatsApp (à personnaliser)
    const phoneNumber = "212779639119"; // Format international sans +
    
    // Créer le lien WhatsApp
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(whatsappMessage)}`;
    
    // Réinitialiser le bouton après un court délai
    setTimeout(() => {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        // Ouvrir WhatsApp dans un nouvel onglet
        window.open(whatsappUrl, '_blank');
        
        // Afficher le message de confirmation
        showContactSuccess(`Message préparé pour WhatsApp! Redirection vers l'application...`);
        
        // Réinitialiser le formulaire
        document.getElementById('contactForm').reset();
    }, 1000);
}

// Fonction pour valider l'email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Fonction pour afficher les erreurs de formulaire
function showContactError(message) {
    removeExistingMessages();
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'alert alert-error';
    errorDiv.innerHTML = `
        <i class="fas fa-exclamation-circle"></i>
        <span>${message}</span>
    `;
    
    errorDiv.style.cssText = `
        background-color: #fee;
        color: #c33;
        padding: 12px 15px;
        border-radius: 4px;
        margin-bottom: 20px;
        border: 1px solid #fcc;
        display: flex;
        align-items: center;
        gap: 10px;
    `;
    
    const contactForm = document.getElementById('contactForm');
    contactForm.insertBefore(errorDiv, contactForm.firstChild);
    
    setTimeout(() => {
        if (errorDiv.parentNode) {
            errorDiv.parentNode.removeChild(errorDiv);
        }
    }, 5000);
}

// Fonction pour afficher les messages de succès
function showContactSuccess(message) {
    removeExistingMessages();
    
    const successDiv = document.createElement('div');
    successDiv.className = 'alert alert-success';
    successDiv.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>${message}</span>
    `;
    
    successDiv.style.cssText = `
        background-color: #efe;
        color: #363;
        padding: 12px 15px;
        border-radius: 4px;
        margin-bottom: 20px;
        border: 1px solid #cfc;
        display: flex;
        align-items: center;
        gap: 10px;
    `;
    
    const contactForm = document.getElementById('contactForm');
    contactForm.insertBefore(successDiv, contactForm.firstChild);
    
    successDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
    
    setTimeout(() => {
        if (successDiv.parentNode) {
            successDiv.parentNode.removeChild(successDiv);
        }
    }, 5000);
}

// Fonction pour supprimer les messages existants
function removeExistingMessages() {
    const existingAlerts = document.querySelectorAll('.alert-error, .alert-success');
    existingAlerts.forEach(alert => {
        if (alert.parentNode) {
            alert.parentNode.removeChild(alert);
        }
    });
}

// Configuration de la validation en temps réel
function setupRealTimeValidation() {
    const emailInput = document.getElementById('contactEmail');
    if (emailInput) {
        emailInput.addEventListener('blur', function() {
            if (this.value && !isValidEmail(this.value)) {
                showFieldError(this, 'Adresse email invalide');
            } else {
                clearFieldError(this);
            }
        });
    }
    
    const requiredFields = document.querySelectorAll('#contactForm input[required], #contactForm textarea[required]');
    requiredFields.forEach(field => {
        field.addEventListener('blur', function() {
            if (!this.value.trim()) {
                showFieldError(this, 'Ce champ est obligatoire');
            } else {
                clearFieldError(this);
            }
        });
    });
}

// Fonction pour afficher une erreur de champ spécifique
function showFieldError(field, message) {
    clearFieldError(field);
    
    field.style.borderColor = '#e63946';
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
        color: #e63946;
        font-size: 0.85rem;
        margin-top: 5px;
    `;
    
    field.parentNode.appendChild(errorDiv);
}

// Fonction pour effacer l'erreur de champ
function clearFieldError(field) {
    field.style.borderColor = '';
    
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.parentNode.removeChild(existingError);
    }
}

// Fonction alternative pour ouvrir WhatsApp (bouton séparé)
function openWhatsAppDirectly() {
    const name = document.getElementById('contactName').value;
    const email = document.getElementById('contactEmail').value;
    const subject = document.getElementById('contactSubject').value;
    const message = document.getElementById('contactMessage').value;
    
    if (!name || !email || !subject || !message) {
        showContactError('Veuillez remplir tous les champs avant d\'envoyer via WhatsApp.');
        return;
    }
    
    const whatsappMessage = `📧 Message Contact - 241stream

👤 Nom: ${name}
📧 Email: ${email}
📋 Sujet: ${subject}

💬 Message:
${message}

---
Date: ${new Date().toLocaleString('fr-FR')}`;

    const phoneNumber = "212779639119";
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(whatsappMessage)}`, '_blank');
}