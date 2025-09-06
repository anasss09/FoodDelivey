import Spinner from 'react-bootstrap/Spinner';
import "bootstrap/dist/css/bootstrap.min.css"; // make sure this is imported!

function MySpinner() {
  return (
    <div className='Spinner-custom'>
    <Spinner animation="border" variant="secondary" />
    </div>
  );
}

export default MySpinner;