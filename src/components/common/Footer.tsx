import { Link } from "react-router-dom";
import { Github, Twitter, Linkedin, Mail, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-background py-12 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-bold">BOOSTGG</h3>
            <p className="text-sm text-muted-foreground">
              La solution complète pour gérer vos tournois esport et suivre les performances des équipes.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="https://github.com/srkodev" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="https://x.com/srko_dj" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="https://www.linkedin.com/in/jules-crevoisier/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div className="space-y-4 flex flex-col items-center text-center">
            <h3 className="text-lg font-bold">Liens rapides</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Accueil
                </Link>
              </li>
              <li>
                <Link to="/tournois" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Tournois
                </Link>
              </li>
              <li>
                <Link to="/equipes" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Équipes
                </Link>
              </li>
              <li>
                <Link to="/recherche" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Recherche
                </Link>
              </li>
              <li>
                <Link to="/admin" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Administration
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-bold">Contact</h3>
            <ul className="space-y-2">
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">contact@vosoft.fr</span>
              </li>
              <li className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">9 Rue Quebec, 10430 Rosières-prés-Troyes</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground text-center">
            © {new Date().getFullYear()} BOOSTGG. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
