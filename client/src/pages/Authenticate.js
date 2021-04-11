import React from 'react';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/index.css';

export default function LoginPage() {
  const googleLogin = () => {
    window.open('http://localhost:8080/auth/google', '_self');
  };

  const githubLogin = () => {
    window.open('http://localhost:8080/auth/github', '_self');
  };

  const twitterLogin = () => {
    window.open('http://localhost:8080/auth/twitter', '_self');
  };

  return (
    <div>
      <div>
        <h1>Login</h1>
        <Button onClick={googleLogin}>
          <img alt="Google Icon" />
          <p>Login With Google</p>
        </Button>

        <Button onClick={githubLogin}>
          <img alt="Github Icon" />
          <p>Login With Github</p>
        </Button>

        <Button onClick={twitterLogin}>
          <img alt="Twitter Icon" />
          <p>Login With Twitter</p>
        </Button>
      </div>
    </div>
  );
}
