import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useAtom } from 'jotai';  // Import useAtom from Jotai
import { searchHistoryAtom } from '../store';  // Import searchHistoryAtom
import { addToHistory } from '@/lib/userData'; // Import the addToHistory function

export default function AdvancedSearch() {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors } } = useForm();
  
  // Access searchHistoryAtom and setSearchHistory from Jotai
  const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom);

  // Function to handle form submission and create the query string
  const submitForm = async (data) => {
    let queryString = '';
  
    // Apply `searchBy` directly as a key with `true` value
    if (data.searchBy) queryString += `${data.searchBy}=true`;
  
    // Additional parameters
    if (data.geoLocation) queryString += `&geoLocation=${data.geoLocation}`;
    if (data.medium) queryString += `&medium=${data.medium}`;
    
    // Default values for `isOnView` and `isHighlight` checkboxes
    queryString += `&isOnView=${data.isOnView || false}`;
    queryString += `&isHighlight=${data.isHighlight || false}`;
  
    // Always include the search query
    queryString += `&q=${data.q}`;
  
    try {
      // Update search history in backend and atom
      const updatedHistory = await addToHistory(queryString);
      setSearchHistory(updatedHistory);
  
      // Navigate to artwork page
      router.push(`/artwork?${queryString}`);
    } catch (error) {
      console.error('Error updating history:', error.message);
    }
  };

  return (
    <Form onSubmit={handleSubmit(submitForm)} className="p-3">
      <Row>
        <Col xs={12} md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Search Query</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your query"
              name="q"
              {...register('q', { required: true })}
              className={errors.q ? 'is-invalid' : ''}
            />
            {errors.q && <div className="invalid-feedback">This field is required</div>}
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col xs={12} md={4}>
          <Form.Label>Search By</Form.Label>
          <Form.Select name="searchBy" className="mb-3" {...register('searchBy')}>
            <option value="title">Title</option>
            <option value="tags">Tags</option>
            <option value="artistOrCulture">Artist or Culture</option>
          </Form.Select>
        </Col>
        <Col xs={12} md={4}>
          <Form.Group className="mb-3">
            <Form.Label>Geo Location</Form.Label>
            <Form.Control
              type="text"
              placeholder="e.g. Paris | France"
              name="geoLocation"
              {...register('geoLocation')}
            />
            <Form.Text className="text-muted">
              Case-sensitive, multiple values separated by &quot;|&quot;
            </Form.Text>
          </Form.Group>
        </Col>
        <Col xs={12} md={4}>
          <Form.Group className="mb-3">
            <Form.Label>Medium</Form.Label>
            <Form.Control
              type="text"
              placeholder="e.g. Paintings | Sculpture"
              name="medium"
              {...register('medium')}
            />
            <Form.Text className="text-muted">
              Case-sensitive, multiple values separated by &quot;|&quot;
            </Form.Text>
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col xs={12}>
          <Form.Check
            type="checkbox"
            label="Highlighted"
            name="isHighlight"
            {...register('isHighlight')}
          />
          <Form.Check
            type="checkbox"
            label="Currently on View"
            name="isOnView"
            {...register('isOnView')}
          />
        </Col>
      </Row>

      <Row>
        <Col xs={12}>
          <br />
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Col>
      </Row>
    </Form>
  );
}
