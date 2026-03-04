import axios from 'axios';

const req1 = axios.post(
  'https://tenant.moviehub.biz/v1/watch-history/tracking',
  {
    lastWatchSeconds: 2970,
    movieItemId: 8970543164882944
  },
  {
    headers: {
      'X-Tenant': 'moviehub',
      'Content-Type': 'application/json',
      Authorization:
        'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2tpbmQiOjEwLCJ0ZW5hbnRfaW5mbyI6Im1vdmllaHViJjg1OTk3Mjk4OTI5NTAwMTYiLCJ1c2VyX2lkIjo5MDI0NTk5NDg4ODU2MDY0LCJncmFudF90eXBlIjoidXNlciIsImFkZGl0aW9uYWxfaW5mbyI6ImVKeXpOREF5TWJXME5MR3dzREExTXpBenFkRTFyREUwcUxHeGd6SktpMU9MTXZOS1VvdnlFbk5BUWtDVWxwaFRuRnFUbTErV21acFJtcVJtQWRSdWJtUnBZV2xrYVdwZ1lHZ0dBUGF6R09rPSIsInVzZXJfbmFtZSI6InVzZXJpbnRlcm5hbCIsInNjb3BlIjpbInJlYWQiLCJ3cml0ZSJdLCJleHAiOjE3NzIwOTkwMDIsImF1dGhvcml0aWVzIjpbIlJPTEVfQ01UX1ZPVEUiLCJST0xFX1JFVl9DIiwiUk9MRV9GSUxFX1UiLCJST0xFX1JFVl9EIiwiUk9MRV9DTVRfQyIsIlJPTEVfQ01UX0QiLCJST0xFX0NNVF9VIiwiUk9MRV9SRVZfVk9URSJdLCJqdGkiOiIxYjc0MTdkMi1hODY3LTQ5NDktYWRhMi03OWRmZmZlMGM3OTUiLCJjbGllbnRfaWQiOiJhYmNfY2xpZW50In0.W34Omj_AYSAgEsFQmiaTItxjlCiMfFazRZpLyonqczc'
    }
  }
);

const req2 = axios.post(
  'https://tenant.moviehub.biz/v1/watch-history/tracking',
  { lastWatchSeconds: 2970, movieItemId: 8970543164882944 },
  {
    headers: {
      'X-Tenant': 'moviehub',
      'Content-Type': 'application/json',
      Authorization:
        'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2tpbmQiOjEwLCJ0ZW5hbnRfaW5mbyI6Im1vdmllaHViJjg1OTk3Mjk4OTI5NTAwMTYiLCJ1c2VyX2lkIjo5MDI0NTk5NDg4ODU2MDY0LCJncmFudF90eXBlIjoidXNlciIsImFkZGl0aW9uYWxfaW5mbyI6ImVKeXpOREF5TWJXME5MR3dzREExTXpBenFkRTFyREUwcUxHeGd6SktpMU9MTXZOS1VvdnlFbk5BUWtDVWxwaFRuRnFUbTErV21acFJtcVJtQWRSdWJtUnBZV2xrYVdwZ1lHZ0dBUGF6R09rPSIsInVzZXJfbmFtZSI6InVzZXJpbnRlcm5hbCIsInNjb3BlIjpbInJlYWQiLCJ3cml0ZSJdLCJleHAiOjE3NzIwOTkwMDIsImF1dGhvcml0aWVzIjpbIlJPTEVfQ01UX1ZPVEUiLCJST0xFX1JFVl9DIiwiUk9MRV9GSUxFX1UiLCJST0xFX1JFVl9EIiwiUk9MRV9DTVRfQyIsIlJPTEVfQ01UX0QiLCJST0xFX0NNVF9VIiwiUk9MRV9SRVZfVk9URSJdLCJqdGkiOiIxYjc0MTdkMi1hODY3LTQ5NDktYWRhMi03OWRmZmZlMGM3OTUiLCJjbGllbnRfaWQiOiJhYmNfY2xpZW50In0.W34Omj_AYSAgEsFQmiaTItxjlCiMfFazRZpLyonqczc'
    }
  }
);

Promise.all([req1, req2])
  .then((res) => console.log(res))
  .catch((err) => console.log(err));
