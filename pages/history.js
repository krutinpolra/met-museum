import { useAtom } from 'jotai'; // to access the search history atom
import { useRouter } from 'next/router';
import { searchHistoryAtom } from '../store';
import { ListGroup, Button, Card } from 'react-bootstrap';
import styles from '@/styles/History.module.css'; // Import the CSS Module for styling
import { removeFromHistory } from '@/lib/userData'; // Import removeFromHistory function

// History Component
export default function History() {
  const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom); // Access searchHistory from atom
  const router = useRouter();

  // Parse the search history to show it in a readable format
  if (!searchHistory) return null;

  // Parse the search history
  let parsedHistory = searchHistory.map((h) => {
    const params = new URLSearchParams(h);
    return Object.fromEntries(params.entries());
  });

  // Function for handling click on a history item
  const historyClicked = (e, index) => {
    e.preventDefault(); // Prevent default action
    router.push(`/artwork?${searchHistory[index]}`); // Navigate to artwork page with the selected query
  };

  // Function to remove an item from the search history
  const removeHistoryClicked = async (e, index) => {
    e.stopPropagation(); // Prevent the event from triggering other actions
    setSearchHistory(await removeFromHistory(searchHistory[index]));
  };

  return (
    <div className="p-3">
      {parsedHistory.length === 0 ? (
        <Card>
            <Card.Body>
            <h4>Nothing Here</h4>
            <p>Try searching for something else.</p>
            </Card.Body>
        </Card>
      ) : (
        <ListGroup>
          {parsedHistory.map((historyItem, index) => (
            <ListGroup.Item
              key={index}
              className={`d-flex align-items-center justify-content-between mb-3 ${styles.historyListItem}`} // Flex layout and margin bottom
              onClick={(e) => historyClicked(e, index)} // Handle click
            >
              <div className="d-flex flex-wrap">
                {Object.keys(historyItem).map(key => (
                  <div key={key} className="me-3"> {/* Space between each key-value pair */}
                    <strong>{key}:</strong> {historyItem[key]}
                  </div>
                ))}
              </div>
              <Button 
                className="float-end" 
                variant="danger" 
                size="sm" 
                onClick={(e) => removeHistoryClicked(e, index)} 
              >
                &times;
              </Button>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </div>
  );
}
