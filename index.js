// Public key not required in backend
// pk_test_51H531FKGDDLrneHhghB43K2u1qXLmsy1pY8JhpLMqI9y42AyLRhV4mLWwG0y9hXxxou8936nSDOFe3ZdqRnn6q1i00zVnLYM9z

const cors = require('cors');
const express = require('express');
const stripe = require('stripe')(
  // stripe secret key
  'sk_test_51H531FKGDDLrneHhKwhhRJdIwlH7ewXOYwfyZgGQPkdGNFFBQur1YlQsSNQsQZKHsdbdN0dLSKTKxYfyPfkaW0mg00kHk3Nb8H'
);
const { v4: uuidv4 } = require('uuid');

const app = express();

//middleware

app.use(express.json());
app.use(cors());

//routes

app.get('/', (req, res) => {
  res.send('Port is Up for Work !!!');
});

app.post('/payment', (req, res) => {
  const { product, token } = req.body;
  console.log('Product', product);
  console.log('Price', product.price);

  const itempontencyKey = uuidv4();

  return stripe.customers
    .create({
      email: token.email,
      source: token.id,
    })
    .then((customer) => {
      stripe.charges.create(
        {
          amount: product.price * 100,
          currency: 'usd',
          customer: customer.id,
          receipt_email: token.email,
          description: `Purchase of ${product.name}`,
          shipping: {
            name: token.card.name,
            address: {
              country: token.card.address_country,
            },
          },
        },
        { itempontencyKey }
      );
    })
    .then((result) => res.status(200).json(result))
    .catch((err) => console.log('Error', err));
});

//listen

app.listen(8282, () => console.log('LISTENING AT PORT 8282'));
