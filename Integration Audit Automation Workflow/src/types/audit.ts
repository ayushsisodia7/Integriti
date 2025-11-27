export interface MerchantData {
  mid: string;
  companyName: string;
  email: string;
  accountManager: {
    name: string;
    email: string;
  };
  availableFeatures: string[];
  products: Product[];
  childMIDs?: ChildMID[];
}

export interface ChildMID {
  mid: string;
  businessName: string;
  ownerEmail: string;
  mcc: string;
  availableFeatures: string[];
  products: Product[];
  accountManager: {
    name: string;
    email: string;
  };
}

export interface Product {
  id: string;
  name: string;
  description: string;
  requiredFeatures: string[];
  identifierType: 'payment_id' | 'token_id' | 'order_id' | 'transaction_id';
  identifierLabel: string;
}

export interface MissingFeature {
  feature: string;
  impact: 'High' | 'Medium' | 'Low';
  description: string;
}

export interface AuditDetails {
  identifier: string;
  transactionAmount?: number;
  currency?: string;
  status: string;
  timestamp: string;
  metadata: Record<string, any>;
  failureDetails?: {
    errorCode: string;
    errorReason: string;
    errorDescription: string;
    nextSteps: string[];
  };
}

export interface ChecklistItem {
  id: string;
  category: string;
  requirement: string;
  status: 'implemented' | 'not-implemented' | 'recommended';
  autoPopulated: boolean;
  suggestion?: string;
  explanation?: string;
  importance?: string;
}

export interface AuditState {
  step: number;
  merchantData: MerchantData | null;
  selectedProduct: Product | null;
  missingFeatures: MissingFeature[];
  identifier: string;
  auditDetails: AuditDetails | null;
  checklist: ChecklistItem[];
  isValidating: boolean;
  isGeneratingChecklist: boolean;
}