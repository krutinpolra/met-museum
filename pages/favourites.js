import React from 'react';
import { useAtom } from 'jotai';
import { favouritesAtom } from '../store';
import { Row, Col, Card, Button } from 'react-bootstrap';
import ArtworkCard from '../components/ArtworkCard';
import { removeFromFavourites } from '@/lib/userData'; // Import API function

const FavouritesPage = () => {
  const [favouritesList, setFavouritesList] = useAtom(favouritesAtom);

  if (!favouritesList) return null; // Prevent temporary "Nothing Here" message

  const handleRemoveFavourite = async (objectID) => {
    try {
      const updatedList = await removeFromFavourites(objectID);
      setFavouritesList(updatedList);
    } catch (error) {
      console.error('Error removing favourite:', error.message);
    }
  };

  if (favouritesList.length === 0) {
    return (
      <Card>
        <Card.Body>
          <h4>Nothing Here</h4>
          <p>Try searching for something else.</p>
        </Card.Body>
      </Card>
    );
  }

  return (
    <div className="container mt-5">
      <h3>Your Favourites</h3>
      <Row>
        {favouritesList.map((objectID) => (
          <Col key={objectID} xs={12} sm={6} md={4} lg={3}>
            <div className="mb-1">
              <ArtworkCard objectID={objectID} />
              <Button
                variant="outline-danger"
                onClick={() => handleRemoveFavourite(objectID)}
              >
                Remove from Favourites
              </Button>
            </div>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default FavouritesPage;
