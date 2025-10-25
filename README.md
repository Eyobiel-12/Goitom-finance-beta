# Goitom Finance Beta

Een moderne, professionele financiële management applicatie voor freelancers en ondernemers in Nederland.

## 🚀 Features

- **Dashboard**: Overzicht van je bedrijfsprestaties
- **Klantbeheer**: Beheer je klanten en hun gegevens
- **Projectbeheer**: Houd projecten en tijdlijnen bij
- **Factuurbeheer**: Maak professionele facturen met PDF export
- **BTW Rapporten**: Genereer BTW rapporten voor Nederlandse belastingwetgeving
- **Instellingen**: Configureer je bedrijfsgegevens en voorkeuren

## 🛠️ Tech Stack

- **Frontend**: Next.js 16, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **UI Components**: shadcn/ui
- **PDF Generation**: jsPDF
- **Styling**: Tailwind CSS v4 met custom animaties

## 📋 Vereisten

- Node.js 18+ 
- pnpm
- Supabase account

## 🚀 Installatie

1. Clone de repository:
```bash
git clone https://github.com/Eyobiel-12/Goitom-finance-beta.git
cd Goitom-finance-beta
```

2. Installeer dependencies:
```bash
pnpm install
```

3. Configureer environment variabelen:
```bash
cp .env.example .env.local
```

4. Vul je Supabase credentials in `.env.local`

5. Start de development server:
```bash
pnpm dev
```

## 🗄️ Database Setup

Voer de SQL scripts uit in de `scripts/` directory in volgorde:

1. `001_create_profiles.sql`
2. `002_create_organizations.sql`
3. `003_create_clients.sql`
4. `004_create_projects.sql`
5. `005_create_invoices.sql`
6. `006_create_invoice_items.sql`
7. `007_create_vat_reports.sql`
8. `008_create_settings.sql`
9. `009_update_currency_to_eur.sql`
10. `010_add_logo_support.sql`
11. `011_add_logo_support_safe.sql`
12. `012_setup_logo_storage.sql`
13. `013_create_logos_bucket.sql`
14. `014_check_logo_columns.sql`
15. `015_final_logo_setup.sql`

## 🎨 Features

### Modern UI/UX
- Glass morphism effects
- Gradient backgrounds
- Smooth animations
- Responsive design
- Dark/Light mode ready

### Professional PDF Generation
- Enterprise-level invoice design
- Multiple styling options
- Logo integration
- Dutch VAT calculations
- Professional layouts

### Dutch Localization
- Complete Dutch interface
- EUR currency formatting
- Dutch date formats
- BTW (VAT) calculations
- Local business practices

## 📱 Screenshots

[Voeg screenshots toe van de applicatie]

## 🤝 Contributing

1. Fork de repository
2. Maak een feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit je changes (`git commit -m 'Add some AmazingFeature'`)
4. Push naar de branch (`git push origin feature/AmazingFeature`)
5. Open een Pull Request

## 📄 License

Dit project is gelicenseerd onder de MIT License - zie het [LICENSE](LICENSE) bestand voor details.

## 👨‍💻 Auteur

**Eyobiel Goitom**
- GitHub: [@Eyobiel-12](https://github.com/Eyobiel-12)

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) voor het geweldige React framework
- [Supabase](https://supabase.com/) voor de backend services
- [shadcn/ui](https://ui.shadcn.com/) voor de UI components
- [Tailwind CSS](https://tailwindcss.com/) voor de styling
