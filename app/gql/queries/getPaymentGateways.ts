export const getPaymentGateways = `
  query GetPaymentGateways {
    paymentGateways {
      nodes {
        id
        title
        description
      }
    }
  }
`;