import { MerchantData, Product, MissingFeature, AuditDetails, ChecklistItem } from '../types/audit';

export const mockMerchantData: Record<string, MerchantData> = {
  'MID123456': {
    mid: 'MID123456',
    companyName: 'TechCorp Solutions (Parent)',
    email: 'owner@techcorp.com',
    accountManager: {
      name: 'Sarah Johnson',
      email: 'sarah.johnson@company.com'
    },
    availableFeatures: [
      'Payment Processing',
      'Tokenization',
      'Fraud Detection',
      'Recurring Billing',
      'Multi-currency',
      'Webhooks'
    ],
    products: [
      {
        id: 'payment-gateway',
        name: 'Payment Gateway',
        description: 'Core payment processing functionality',
        requiredFeatures: ['Payment Processing', 'Fraud Detection', 'PCI Compliance', 'SSL Encryption'],
        identifierType: 'payment_id',
        identifierLabel: 'Payment ID'
      },
      {
        id: 'tokenization-service',
        name: 'Tokenization Service',
        description: 'Secure token management for sensitive data',
        requiredFeatures: ['Tokenization', 'Data Encryption', 'Token Lifecycle Management'],
        identifierType: 'token_id',
        identifierLabel: 'Token ID'
      },
      {
        id: 'subscription-billing',
        name: 'Subscription Billing',
        description: 'Recurring payment management',
        requiredFeatures: ['Recurring Billing', 'Payment Processing', 'Invoice Generation', 'Dunning Management'],
        identifierType: 'order_id',
        identifierLabel: 'Subscription Order ID'
      }
    ],
    childMIDs: [
      {
        mid: 'MID123456',
        businessName: 'TechCorp Solutions Main',
        ownerEmail: 'owner@techcorp.com',
        mcc: '5734',
        accountManager: {
          name: 'Sarah Johnson',
          email: 'sarah.johnson@company.com'
        },
        availableFeatures: [
          'Payment Processing',
          'Tokenization',
          'Fraud Detection',
          'Recurring Billing',
          'Multi-currency',
          'Webhooks'
        ],
        products: [
          {
            id: 'payment-gateway',
            name: 'Payment Gateway',
            description: 'Core payment processing functionality',
            requiredFeatures: ['Payment Processing', 'Fraud Detection', 'PCI Compliance', 'SSL Encryption'],
            identifierType: 'payment_id',
            identifierLabel: 'Payment ID'
          },
          {
            id: 'tokenization-service',
            name: 'Tokenization Service',
            description: 'Secure token management for sensitive data',
            requiredFeatures: ['Tokenization', 'Data Encryption', 'Token Lifecycle Management'],
            identifierType: 'token_id',
            identifierLabel: 'Token ID'
          },
          {
            id: 'subscription-billing',
            name: 'Subscription Billing',
            description: 'Recurring payment management',
            requiredFeatures: ['Recurring Billing', 'Payment Processing', 'Invoice Generation', 'Dunning Management'],
            identifierType: 'order_id',
            identifierLabel: 'Subscription Order ID'
          }
        ]
      },
      {
        mid: 'MID123457',
        businessName: 'TechCorp EU Division',
        ownerEmail: 'eu@techcorp.com',
        mcc: '5812',
        accountManager: {
          name: 'Sarah Johnson',
          email: 'sarah.johnson@company.com'
        },
        availableFeatures: [
          'Payment Processing',
          'Multi-currency',
          'Webhooks'
        ],
        products: [
          {
            id: 'payment-gateway',
            name: 'Payment Gateway',
            description: 'Core payment processing functionality',
            requiredFeatures: ['Payment Processing', 'Fraud Detection', 'PCI Compliance', 'SSL Encryption'],
            identifierType: 'payment_id',
            identifierLabel: 'Payment ID'
          }
        ]
      }
    ]
  },
  'MID789012': {
    mid: 'MID789012',
    companyName: 'E-Commerce Plus',
    email: 'admin@ecommerceplus.com',
    accountManager: {
      name: 'Michael Chen',
      email: 'michael.chen@company.com'
    },
    availableFeatures: [
      'Payment Processing',
      'Multi-currency',
      'Webhooks',
      '3D Secure'
    ],
    products: [
      {
        id: 'payment-gateway',
        name: 'Payment Gateway',
        description: 'Core payment processing functionality',
        requiredFeatures: ['Payment Processing', 'Fraud Detection', 'PCI Compliance', 'SSL Encryption'],
        identifierType: 'payment_id',
        identifierLabel: 'Payment ID'
      }
    ],
    childMIDs: [
      {
        mid: 'MID789012',
        businessName: 'E-Commerce Plus Main',
        ownerEmail: 'admin@ecommerceplus.com',
        mcc: '5411',
        accountManager: {
          name: 'Michael Chen',
          email: 'michael.chen@company.com'
        },
        availableFeatures: [
          'Payment Processing',
          'Multi-currency',
          'Webhooks',
          '3D Secure'
        ],
        products: [
          {
            id: 'payment-gateway',
            name: 'Payment Gateway',
            description: 'Core payment processing functionality',
            requiredFeatures: ['Payment Processing', 'Fraud Detection', 'PCI Compliance', 'SSL Encryption'],
            identifierType: 'payment_id',
            identifierLabel: 'Payment ID'
          }
        ]
      }
    ]
  }
};

export const getMissingFeatures = (availableFeatures: string[], requiredFeatures: string[]): MissingFeature[] => {
  const missing = requiredFeatures.filter(feature => !availableFeatures.includes(feature));
  
  const missingFeatureDetails: Record<string, MissingFeature> = {
    'Fraud Detection': {
      feature: 'Fraud Detection',
      impact: 'High',
      description: 'Advanced fraud screening and risk assessment capabilities'
    },
    'PCI Compliance': {
      feature: 'PCI Compliance',
      impact: 'High',
      description: 'Payment Card Industry Data Security Standard compliance'
    },
    'SSL Encryption': {
      feature: 'SSL Encryption',
      impact: 'High',
      description: 'Secure Socket Layer encryption for data transmission'
    },
    'Data Encryption': {
      feature: 'Data Encryption',
      impact: 'High',
      description: 'End-to-end data encryption for sensitive information'
    },
    'Token Lifecycle Management': {
      feature: 'Token Lifecycle Management',
      impact: 'Medium',
      description: 'Comprehensive token creation, rotation, and expiration management'
    },
    'Invoice Generation': {
      feature: 'Invoice Generation',
      impact: 'Medium',
      description: 'Automated invoice creation and delivery system'
    },
    'Dunning Management': {
      feature: 'Dunning Management',
      impact: 'Medium',
      description: 'Automated retry logic for failed recurring payments'
    }
  };

  return missing.map(feature => missingFeatureDetails[feature] || {
    feature,
    impact: 'Low' as const,
    description: `${feature} functionality is required for this product`
  });
};

export const mockAuditDetails: Record<string, AuditDetails> = {
  'PAY_123456789': {
    identifier: 'PAY_123456789',
    transactionAmount: 299.99,
    currency: 'USD',
    status: 'completed',
    timestamp: '2024-09-24T10:30:00Z',
    metadata: {
      merchantId: 'MID123456',
      paymentMethod: 'credit_card',
      cardBrand: 'visa',
      lastFour: '4242',
      authCode: 'ABC123'
    }
  },
  'PAY_FAILED_001': {
    identifier: 'PAY_FAILED_001',
    transactionAmount: 150.00,
    currency: 'USD',
    status: 'failed',
    timestamp: '2024-09-25T14:22:00Z',
    metadata: {
      merchantId: 'MID123456',
      paymentMethod: 'credit_card',
      cardBrand: 'mastercard',
      lastFour: '8888',
      attemptCount: 1
    },
    failureDetails: {
      errorCode: 'BAD_REQUEST_ERROR',
      errorReason: 'Payment failed due to insufficient funds',
      errorDescription: 'The customer\'s bank declined the transaction because there are not enough funds available in the account to complete the payment. This is a common issue that occurs when the account balance is lower than the transaction amount.',
      nextSteps: [
        'Contact the customer to inform them about the insufficient funds issue',
        'Request the customer to try a different payment method or card',
        'Suggest the customer to check their account balance and retry the payment',
        'Consider enabling retry logic or dunning management to automatically retry failed payments',
        'Review your payment failure handling mechanism to provide better customer experience'
      ]
    }
  },
  'PAY_FAILED_002': {
    identifier: 'PAY_FAILED_002',
    transactionAmount: 500.00,
    currency: 'USD',
    status: 'failed',
    timestamp: '2024-09-25T16:45:00Z',
    metadata: {
      merchantId: 'MID123456',
      paymentMethod: 'credit_card',
      cardBrand: 'visa',
      lastFour: '1234',
      attemptCount: 1
    },
    failureDetails: {
      errorCode: 'GATEWAY_ERROR',
      errorReason: 'Card authentication failed',
      errorDescription: 'The payment failed during 3D Secure authentication. This happens when the customer either cancels the authentication process, enters incorrect OTP, or the authentication times out. 3D Secure is an additional security layer required by banks to verify the cardholder\'s identity.',
      nextSteps: [
        'Notify the customer that the authentication process was not completed',
        'Ask the customer to retry the payment and complete the authentication step',
        'Ensure your checkout properly handles 3D Secure authentication flow',
        'Verify that 3D Secure is properly configured in your payment gateway settings',
        'Check if the customer\'s bank supports 3D Secure authentication',
        'Consider providing clear instructions about the authentication process during checkout'
      ]
    }
  },
  'PAY_FAILED_003': {
    identifier: 'PAY_FAILED_003',
    transactionAmount: 75.99,
    currency: 'USD',
    status: 'failed',
    timestamp: '2024-09-25T11:30:00Z',
    metadata: {
      merchantId: 'MID789012',
      paymentMethod: 'credit_card',
      cardBrand: 'amex',
      lastFour: '5678',
      attemptCount: 2
    },
    failureDetails: {
      errorCode: 'BAD_REQUEST_ERROR',
      errorReason: 'Card expired',
      errorDescription: 'The payment could not be processed because the credit card has passed its expiration date. Card issuers typically include an expiration date (month/year) on cards, after which the card becomes invalid and cannot be used for transactions.',
      nextSteps: [
        'Contact the customer immediately to update their payment information',
        'Request the customer to provide a new card with a valid expiration date',
        'If this is a subscription, pause the service until payment method is updated',
        'Implement card expiry notifications to proactively alert customers before cards expire',
        'Enable automatic card updater services if available through your payment processor',
        'Send a friendly reminder email with instructions on how to update payment details'
      ]
    }
  },
  'TOK_987654321': {
    identifier: 'TOK_987654321',
    status: 'active',
    timestamp: '2024-09-24T09:15:00Z',
    metadata: {
      merchantId: 'MID123456',
      tokenType: 'payment_method',
      cardBrand: 'mastercard',
      lastFour: '5555',
      expiryDate: '12/2026'
    }
  },
  'ORD_456789123': {
    identifier: 'ORD_456789123',
    transactionAmount: 49.99,
    currency: 'USD',
    status: 'active',
    timestamp: '2024-09-24T08:00:00Z',
    metadata: {
      merchantId: 'MID123456',
      subscriptionType: 'monthly',
      nextBillingDate: '2024-10-24',
      cycleCount: 3
    }
  }
};

export const generateChecklist = (product: Product, auditDetails: AuditDetails, missingFeatures: MissingFeature[]): ChecklistItem[] => {
  // Payment Gateway Checklist
  if (product.id === 'payment-gateway') {
    return [
      {
        id: '1',
        category: 'Authentication',
        requirement: 'API Key Generation',
        status: auditDetails.metadata.authCode ? 'implemented' : 'not-implemented',
        autoPopulated: true,
        suggestion: !auditDetails.metadata.authCode ? 'Generate API keys from your dashboard to authenticate API requests' : undefined,
        explanation: 'API keys are unique secret codes that identify and authenticate your application when communicating with the payment gateway. Think of them like a username and password combination that your website uses to securely access payment services. These keys ensure that only authorized applications can process payments through your account.'
      },
      {
        id: '2',
        category: 'Integration',
        requirement: 'Order API Implementation',
        status: auditDetails.status === 'completed' ? 'implemented' : 'not-implemented',
        autoPopulated: true,
        suggestion: auditDetails.status !== 'completed' ? 'Implement the Order API to create payment orders on your server' : undefined,
        explanation: 'The Order API allows your server to create payment orders before customers make a purchase. It\'s like creating a shopping cart and calculating the total amount before asking for payment. This API call generates a unique order ID that tracks the transaction from start to finish, ensuring proper record-keeping and reconciliation.'
      },
      {
        id: '3',
        category: 'Integration',
        requirement: 'Checkout Implementation',
        status: auditDetails.metadata.paymentMethod ? 'implemented' : 'not-implemented',
        autoPopulated: true,
        suggestion: !auditDetails.metadata.paymentMethod ? 'Integrate the checkout interface on your website or app to collect payment details' : undefined,
        explanation: 'Checkout implementation is the payment form where customers enter their credit card or payment information. It\'s the digital equivalent of a physical payment terminal at a store. A properly implemented checkout provides a secure, user-friendly interface that guides customers through the payment process while protecting their sensitive data.'
      },
      {
        id: '4',
        category: 'Security',
        requirement: 'Signature Verification',
        status: auditDetails.metadata.authCode ? 'implemented' : 'not-implemented',
        autoPopulated: true,
        suggestion: !auditDetails.metadata.authCode ? 'Implement signature verification to validate payment responses from the gateway' : undefined,
        explanation: 'Signature verification ensures that payment notifications you receive actually came from the legitimate payment gateway and weren\'t forged by hackers. It works like a tamper-proof seal on a package - the gateway creates a unique digital signature using a secret key, and your system verifies this signature to confirm authenticity before processing the order.'
      },
      {
        id: '5',
        category: 'Integration',
        requirement: 'Webhook Configuration',
        status: 'recommended',
        autoPopulated: false,
        suggestion: 'Configure webhooks to receive real-time payment status notifications',
        explanation: 'Webhooks are automated notifications that instantly alert your system when important events happen (like a successful payment or failed transaction). Instead of constantly checking for updates, the payment system sends you a message immediately when something occurs - like getting a text notification instead of repeatedly checking your email.'
      },
      {
        id: '6',
        category: 'Configuration',
        requirement: 'Payment Capture Settings Configuration',
        status: 'recommended',
        autoPopulated: false,
        suggestion: 'Configure whether payments should be captured automatically or manually after authorization',
        explanation: 'Payment capture settings determine when money is actually transferred from the customer\'s account. "Authorize" reserves the funds (like a hotel holding your card), while "Capture" completes the transfer. You can choose automatic capture (immediate) or manual capture (you decide when), which is useful for businesses that need to verify orders or check inventory before charging customers.'
      },
      {
        id: '7',
        category: 'Error Handling',
        requirement: 'Failure Handling Mechanism',
        status: 'recommended',
        autoPopulated: false,
        suggestion: 'Implement proper error handling for failed transactions and display user-friendly messages',
        explanation: 'Failure handling mechanisms detect when payments fail and respond appropriately. This includes showing clear error messages to customers (like "Insufficient funds" or "Card expired"), logging the failure for investigation, and potentially retrying the payment or suggesting alternative payment methods. Good error handling prevents customer frustration and helps troubleshoot issues.'
      },
      {
        id: '8',
        category: 'Integration',
        requirement: 'Refund Implementation',
        status: 'recommended',
        autoPopulated: false,
        suggestion: 'Implement refund functionality to process customer refunds through the API',
        explanation: 'Refund implementation allows you to return money to customers for returns, cancellations, or disputes. It\'s the digital version of giving cash back at a store. The refund API lets you initiate full or partial refunds programmatically, automatically updating your records and the customer\'s account while maintaining a complete audit trail of all transactions.'
      }
    ];
  }

  // Subscription Billing Checklist
  if (product.id === 'subscription-billing') {
    return [
      {
        id: '1',
        category: 'Authentication',
        requirement: 'API Key Generation',
        status: auditDetails.metadata.authCode ? 'implemented' : 'not-implemented',
        autoPopulated: true,
        suggestion: !auditDetails.metadata.authCode ? 'Generate API keys from your dashboard to authenticate API requests' : undefined,
        explanation: 'API keys are unique secret codes that identify and authenticate your application when communicating with the payment gateway. Think of them like a username and password combination that your website uses to securely access payment services. These keys ensure that only authorized applications can process payments through your account.'
      },
      {
        id: '2',
        category: 'Integration',
        requirement: 'Plan API Implementation',
        status: auditDetails.metadata.subscriptionType ? 'implemented' : 'not-implemented',
        autoPopulated: true,
        suggestion: !auditDetails.metadata.subscriptionType ? 'Create subscription plans using the Plan API defining billing cycles and amounts' : undefined,
        explanation: 'The Plan API allows you to create subscription templates that define how often customers are billed (monthly, yearly, etc.) and for how much. Think of it like creating membership tiers for a gym - each plan has specific pricing, duration, and features. Once created, customers can subscribe to these pre-configured plans without you manually setting up each subscription.'
      },
      {
        id: '3',
        category: 'Integration',
        requirement: 'Subscription API Implementation',
        status: auditDetails.metadata.subscriptionType ? 'implemented' : 'not-implemented',
        autoPopulated: true,
        suggestion: !auditDetails.metadata.subscriptionType ? 'Implement the Subscription API to create and manage customer subscriptions' : undefined,
        explanation: 'The Subscription API handles the creation and management of individual customer subscriptions. It\'s like the enrollment system for a subscription service - it associates customers with specific plans, tracks billing cycles, manages upgrades or downgrades, and handles subscription cancellations. This API automates the entire recurring billing lifecycle.'
      },
      {
        id: '4',
        category: 'Integration',
        requirement: 'Webhook Configuration',
        status: 'recommended',
        autoPopulated: false,
        suggestion: 'Configure webhooks to receive notifications about subscription events (renewals, failures, cancellations)',
        explanation: 'Webhooks are automated notifications that instantly alert your system when important subscription events happen (like successful renewals, payment failures, or cancellations). Instead of constantly checking subscription status, the system sends you a message immediately when something occurs - enabling you to take action like sending renewal confirmations or following up on failed payments.'
      },
      {
        id: '5',
        category: 'Integration',
        requirement: 'Checkout Implementation',
        status: auditDetails.metadata.paymentMethod ? 'implemented' : 'not-implemented',
        autoPopulated: true,
        suggestion: !auditDetails.metadata.paymentMethod ? 'Integrate the checkout interface for customers to subscribe and provide payment details' : undefined,
        explanation: 'Checkout implementation for subscriptions is the interface where customers choose a subscription plan and enter their payment information. Unlike one-time payments, subscription checkout often includes plan selection, trial period information, and recurring billing consent. It securely collects and stores payment methods for automatic future charges.'
      },
      {
        id: '6',
        category: 'Integration',
        requirement: 'Refund Implementation',
        status: 'recommended',
        autoPopulated: false,
        suggestion: 'Implement refund functionality for subscription charges and pro-rated cancellations',
        explanation: 'Refund implementation for subscriptions handles returning money to customers for cancelled subscriptions, billing errors, or pro-rated refunds when customers downgrade plans mid-cycle. It\'s more complex than simple refunds because it may involve calculating partial refunds based on usage time and adjusting future billing schedules accordingly.'
      }
    ];
  }

  // Tokenization Service Checklist
  if (product.id === 'tokenization-service') {
    return [
      {
        id: '1',
        category: 'Authentication',
        requirement: 'API Key Generation',
        status: auditDetails.metadata.authCode ? 'implemented' : 'not-implemented',
        autoPopulated: true,
        suggestion: !auditDetails.metadata.authCode ? 'Generate API keys from your dashboard to authenticate API requests' : undefined,
        explanation: 'API keys are unique secret codes that identify and authenticate your application when communicating with the payment gateway. Think of them like a username and password combination that your website uses to securely access payment services. These keys ensure that only authorized applications can process payments through your account.'
      },
      {
        id: '2',
        category: 'Integration',
        requirement: 'Order API Implementation',
        status: auditDetails.status === 'completed' ? 'implemented' : 'not-implemented',
        autoPopulated: true,
        suggestion: auditDetails.status !== 'completed' ? 'Implement the Order API to create tokenized payment orders' : undefined,
        explanation: 'The Order API for tokenization creates payment orders that will generate secure tokens instead of processing direct card charges. This prepares the transaction for token creation, ensuring all necessary data is captured while maintaining security standards. The order ID links the token to the specific transaction for future reference and recurring payments.'
      },
      {
        id: '3',
        category: 'Integration',
        requirement: 'Checkout Implementation',
        status: auditDetails.metadata.paymentMethod ? 'implemented' : 'not-implemented',
        autoPopulated: true,
        suggestion: !auditDetails.metadata.paymentMethod ? 'Integrate the checkout interface to collect and tokenize payment information' : undefined,
        explanation: 'Checkout implementation for tokenization securely collects customer payment details and converts them into tokens. Instead of sending sensitive card data to your servers, the checkout form directly sends it to the tokenization service, which returns a safe token. Your application only receives and stores the token, never the actual card number, significantly reducing security risks.'
      },
      {
        id: '4',
        category: 'Security',
        requirement: 'Signature Verification',
        status: auditDetails.metadata.authCode ? 'implemented' : 'not-implemented',
        autoPopulated: true,
        suggestion: !auditDetails.metadata.authCode ? 'Implement signature verification to validate tokenization responses' : undefined,
        explanation: 'Signature verification ensures that token creation notifications you receive actually came from the legitimate payment gateway and weren\'t forged. It works like a tamper-proof seal - the gateway creates a unique digital signature, and your system verifies this signature to confirm the token is authentic before storing or using it for future transactions.'
      },
      {
        id: '5',
        category: 'Integration',
        requirement: 'Webhook Configuration',
        status: 'recommended',
        autoPopulated: false,
        suggestion: 'Configure webhooks to receive notifications about token lifecycle events',
        explanation: 'Webhooks for tokenization notify your system about important token events like successful creation, expiration warnings, or token updates (when a customer gets a new card). These real-time notifications help you manage stored payment methods, proactively update expired tokens, and maintain smooth recurring payment processing without customer intervention.'
      }
    ];
  }

  // Default fallback
  return [];
};