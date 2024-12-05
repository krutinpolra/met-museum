/*********************************************************************************
* WEB422 – Assignment 4
*
* I declare that this assignment is my own work in accordance with Seneca's
* Academic Integrity Policy:
*
* https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
*
* Name: KRUTIN BHARATBHAI POLRA Student ID: 135416220 Date: November 11th 2024
*
********************************************************************************/

import { Row, Col, Image } from 'react-bootstrap';

export default function Home() {
  return (
    <>
      <Image
        src="https://upload.wikimedia.org/wikipedia/commons/3/30/Metropolitan_Museum_of_Art_%28The_Met%29_-_Central_Park%2C_NYC.jpg"
        alt="Metropolitan Museum of Art"
        fluid
        rounded
      />
      <Row className="mt-4">
        <Col lg={6}>
          <p>
            The Metropolitan Museum of Art of New York City, colloquially referred to as &quot;The Met,&quot; 
            is the largest art museum in the Americas. Its permanent collection contains over two 
            million works, divided among 17 curatorial departments. The main building, at 1000 Fifth 
            Avenue, along the Museum Mile on the eastern edge of Central Park on Manhattan&#39;s Upper 
            East Side, is by area one of the world&#39;s largest art museums.
          </p>
        </Col>
        <Col lg={6}>
          <p>
            A much smaller second location, The Cloisters at Fort Tryon Park in Upper Manhattan,
            contains an extensive collection of art, architecture, and artifacts from medieval
            Europe. On October 13, 2020, the Met announced that it would reopen in August 2021, after
            being temporarily closed due to the COVID-19 pandemic.
          </p>
          <a
            href="https://en.wikipedia.org/wiki/Metropolitan_Museum_of_Art"
            target="_blank"
            rel="noreferrer"
          >
            Read more on Wikipedia
          </a>
        </Col>
      </Row>
    </>
  );
}
