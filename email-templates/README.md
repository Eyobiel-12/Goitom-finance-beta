# Goitom Finance Email Templates

Professionele email templates voor alle Supabase authenticatie emails, speciaal ontworpen voor de Nederlandse markt.

## 📧 Beschikbare Templates

### 1. **Confirm Signup** (`confirm-signup.html`)
- **Gebruik**: Email bevestiging voor nieuwe gebruikers
- **Kleur**: Blauw/Purple gradient
- **Features**: Welkomstbericht, beta status, functie overzicht

### 2. **Invite User** (`invite-user.html`)
- **Gebruik**: Uitnodiging voor nieuwe gebruikers
- **Kleur**: Groen gradient
- **Features**: Uitnodiging details, functie lijst, beta voordelen

### 3. **Change Email** (`change-email.html`)
- **Gebruik**: Email adres wijziging bevestiging
- **Kleur**: Purple gradient
- **Features**: Oude en nieuwe email weergave, beveiligingsinfo

### 4. **Reset Password** (`reset-password.html`)
- **Gebruik**: Wachtwoord reset verzoek
- **Kleur**: Rood gradient
- **Features**: Beveiligingsmelding, wachtwoord tips, veiligheidsinfo

### 5. **Reauthentication** (`reauthentication.html`)
- **Gebruik**: Herauthenticatie voor gevoelige functies
- **Kleur**: Orange gradient
- **Features**: Authenticatiecode weergave, beveiligingsuitleg

### 6. **Magic Link** (`magic-link.html`)
- **Gebruik**: Passwordless login
- **Kleur**: Cyan gradient
- **Features**: Magic link uitleg, voordelen, directe login

## 🎨 Design Features

### **Consistent Branding**
- Goitom Finance logo en naam
- Beta badge op alle templates
- Nederlandse tekst en lokalisatie
- Professionele kleurenschema's

### **Modern Design**
- Responsive HTML/CSS
- Gradient backgrounds
- Glass morphism effects
- Professional typography
- Mobile-friendly layout

### **Security Focus**
- Duidelijke beveiligingsmeldingen
- Tijdslimieten vermelding
- Veiligheidstips en waarschuwingen
- Professional security messaging

## 🚀 Implementatie

### **Supabase Setup**
1. Ga naar je Supabase dashboard
2. Navigeer naar Authentication > Email Templates
3. Selecteer de gewenste template (Confirm signup, Invite user, etc.)
4. Kopieer de HTML code uit het corresponderende bestand
5. Plak de code in de "Message body" sectie
6. Pas de Subject heading aan indien gewenst
7. Sla de wijzigingen op

### **Template Variabelen**
Alle templates gebruiken Supabase's standaard variabelen:
- `{{ .ConfirmationURL }}` - Bevestigingslink
- `{{ .Email }}` - Huidige email
- `{{ .NewEmail }}` - Nieuwe email
- `{{ .Token }}` - Authenticatiecode
- `{{ .SiteURL }}` - Website URL

## 📱 Responsive Design

Alle templates zijn volledig responsive en werken perfect op:
- Desktop computers
- Tablets
- Smartphones
- Email clients (Gmail, Outlook, Apple Mail)

## 🔧 Aanpassingen

### **Kleuren Wijzigen**
Pas de gradient kleuren aan in de CSS:
```css
background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
```

### **Tekst Aanpassen**
Wijzig de Nederlandse tekst naar wens:
- Headers en titels
- Beschrijvingen
- Call-to-action teksten
- Footer informatie

### **Logo Toevoegen**
Vervang de tekst logo door een echte afbeelding:
```html
<img src="https://your-domain.com/logo.png" alt="Goitom Finance" style="width: 48px; height: 48px;">
```

## 📋 Best Practices

1. **Test alle templates** in verschillende email clients
2. **Controleer responsive gedrag** op mobiele apparaten
3. **Verificeer alle links** werken correct
4. **Test met echte email adressen** voordat je live gaat
5. **Monitor email deliverability** en spam scores

## 🎯 Nederlandse Lokalisatie

Alle templates zijn volledig gelokaliseerd voor Nederlandse gebruikers:
- Nederlandse tekst en terminologie
- Nederlandse datum/tijd formaten
- Lokale business practices
- Nederlandse beveiligingsstandaarden

## 📞 Support

Voor vragen over de email templates of implementatie, neem contact op met het Goitom Finance team.

---

**© 2025 Goitom Finance Beta. Alle rechten voorbehouden.**
