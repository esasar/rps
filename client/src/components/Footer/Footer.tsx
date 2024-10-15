import './Footer.css';

export const Footer: React.FC = () => {
  return (
    <footer>
      { `Made by Esa. View source at` }
      &nbsp;
      <a href="https://github.com/esasar/rps">
        Github
      </a>
      { '.' }
    </footer>  
  )
}