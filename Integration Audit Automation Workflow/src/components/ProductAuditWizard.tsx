import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Alert, AlertDescription } from './ui/alert';
import { Separator } from './ui/separator';
import { ChecklistGeneration } from './ChecklistGeneration';
import { MerchantData, Product, MissingFeature, AuditDetails } from '../types/audit';
import { getMissingFeatures, mockAuditDetails, generateChecklist } from '../data/mockData';
import { 
  ArrowLeft, 
  AlertTriangle, 
  Loader2, 
  CheckCircle, 
  Clock,
  Package,
  Search,
  FileText,
  Mail,
  Download,
  Eye,
  Info,
  XCircle,
  AlertCircle,
  RefreshCw,
  HelpCircle
} from 'lucide-react';

interface ProductAuditWizardProps {
  merchantData: MerchantData;
  selectedProduct: Product;
  onBack: () => void;
  loginSource: 'admin' | 'merchant';
}

export function ProductAuditWizard({ merchantData, selectedProduct, onBack, loginSource }: ProductAuditWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [identifier, setIdentifier] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [auditDetails, setAuditDetails] = useState<AuditDetails | null>(null);
  const [error, setError] = useState('');
  const [showFullReport, setShowFullReport] = useState(false);

  const missingFeatures: MissingFeature[] = getMissingFeatures(
    merchantData.availableFeatures,
    selectedProduct.requiredFeatures
  );

  // Different steps for admin vs merchant
  const adminSteps = [
    { number: 1, title: 'Product Overview', icon: Package },
    { number: 2, title: 'Identifier Input', icon: Search },
    { number: 3, title: 'Validation & Details', icon: FileText },
    { number: 4, title: 'Checklist Generation', icon: CheckCircle },
    { number: 5, title: 'Email Confirmation', icon: Mail }
  ];

  const merchantSteps = [
    { number: 1, title: 'Product Overview', icon: Package },
    { number: 2, title: 'Processing Audit', icon: Loader2 },
    { number: 3, title: 'View/Download Report', icon: FileText }
  ];

  const steps = loginSource === 'admin' ? adminSteps : merchantSteps;

  const handleIdentifierSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) {
      setError(`Please enter a valid ${selectedProduct.identifierLabel}`);
      return;
    }

    setError('');

    if (loginSource === 'merchant') {
      // Merchant flow: Skip validation, show processing screen
      const mockDetails = mockAuditDetails[identifier];
      if (!mockDetails) {
        setError(`Invalid ${selectedProduct.identifierLabel}. Try PAY_123456789, TOK_987654321, or ORD_456789123 for demo.`);
        return;
      }
      
      setAuditDetails(mockDetails);
      setCurrentStep(2);
      setIsProcessing(true);
      
      // Simulate processing for 10 seconds
      setTimeout(() => {
        setIsProcessing(false);
        setCurrentStep(3);
      }, 10000);
    } else {
      // Admin flow: Validate and show details
      setIsValidating(true);
      
      // Simulate API validation
      setTimeout(() => {
        const mockDetails = mockAuditDetails[identifier];
        if (mockDetails) {
          setAuditDetails(mockDetails);
          setCurrentStep(3);
        } else {
          setError(`Invalid ${selectedProduct.identifierLabel}. Try PAY_123456789, TOK_987654321, or ORD_456789123 for demo.`);
        }
        setIsValidating(false);
      }, 2000);
    }
  };

  const handleDetailsConfirm = () => {
    setCurrentStep(4);
  };

  const renderStepIndicator = () => (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = currentStep === step.number;
          const isCompleted = currentStep > step.number;
          
          return (
            <div key={step.number} className="flex flex-col items-center">
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center
                ${isActive ? 'bg-blue-600 text-white' : 
                  isCompleted ? 'bg-green-600 text-white' : 
                  'bg-gray-200 text-gray-600'}
              `}>
                {isCompleted ? <CheckCircle className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
              </div>
              <span className="text-xs mt-2 text-center max-w-20">{step.title}</span>
              {index < steps.length - 1 && (
                <div className={`
                  absolute h-0.5 w-16 mt-5 ml-16
                  ${isCompleted ? 'bg-green-600' : 'bg-gray-200'}
                `} style={{ zIndex: -1 }} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderStep1 = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          {selectedProduct.name} Audit Overview
        </CardTitle>
        <CardDescription>
          Review product requirements and start the audit process
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h4 className="mb-3">Product Description</h4>
          <p className="text-muted-foreground">{selectedProduct.description}</p>
        </div>

        <Separator />

        <div>
          <h4 className="mb-3">Available Features</h4>
          <div className="flex flex-wrap gap-2">
            {selectedProduct.requiredFeatures
              .filter(feature => merchantData.availableFeatures.includes(feature))
              .map((feature) => (
                <Badge key={feature} className="bg-green-100 text-green-800 border-green-200">
                  {feature}
                </Badge>
              ))}
          </div>
        </div>

        {loginSource === 'merchant' && (
          <>
            <Separator />
            
            {/* Identifier Input for Merchant */}
            <div>
              <h4 className="mb-3">Enter {selectedProduct.identifierLabel}</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Provide the {selectedProduct.identifierLabel.toLowerCase()} to start the audit process
              </p>
              <form onSubmit={handleIdentifierSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="identifier">{selectedProduct.identifierLabel}</Label>
                  <Input
                    id="identifier"
                    type="text"
                    placeholder={`Enter ${selectedProduct.identifierLabel.toLowerCase()}`}
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    disabled={isValidating}
                  />
                </div>

                {error && (
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Demo Identifiers:</strong>
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    PAY_123456789 • TOK_987654321 • ORD_456789123
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    <strong>Failed Payments:</strong> PAY_FAILED_001 • PAY_FAILED_002 • PAY_FAILED_003
                  </p>
                </div>

                {missingFeatures.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <h4 className="mb-3 flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                        {missingFeatures.length} feature{missingFeatures.length > 1 ? 's' : ''} missing
                      </h4>
                      <div className="space-y-3">
                        {missingFeatures.map((missing) => (
                          <Alert key={missing.feature} className="border-red-200 bg-red-50">
                            <AlertTriangle className="h-4 w-4 text-red-600" />
                            <AlertDescription>
                              <div>
                                <strong className="text-red-800">{missing.feature}</strong>
                                <p className="text-sm text-red-700 mt-1">
                                  {missing.description}
                                </p>
                              </div>
                            </AlertDescription>
                          </Alert>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                <div className="flex justify-between pt-4">
                  <Button type="button" variant="outline" onClick={onBack}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Dashboard
                  </Button>
                  <Button type="submit" disabled={isValidating}>
                    {isValidating && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    {isValidating ? 'Processing...' : 'Start Audit'}
                  </Button>
                </div>
              </form>
            </div>
          </>
        )}

        {loginSource === 'admin' && (
          <>
            {missingFeatures.length > 0 && (
              <>
                <Separator />
                <div>
                  <h4 className="mb-3 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                    {missingFeatures.length} feature{missingFeatures.length > 1 ? 's' : ''} missing
                  </h4>
                  <div className="space-y-3">
                    {missingFeatures.map((missing) => (
                      <Alert key={missing.feature} className="border-red-200 bg-red-50">
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                        <AlertDescription>
                          <div>
                            <strong className="text-red-800">{missing.feature}</strong>
                            <p className="text-sm text-red-700 mt-1">
                              {missing.description}
                            </p>
                          </div>
                        </AlertDescription>
                      </Alert>
                    ))}
                  </div>
                </div>
              </>
            )}
            
            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={onBack}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <Button onClick={() => setCurrentStep(2)}>
                Continue to Identifier Input
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );

  const renderStep2 = () => {
    // Merchant flow: Show processing screen
    if (loginSource === 'merchant') {
      if (isProcessing) {
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                Processing Audit
              </CardTitle>
              <CardDescription>
                Please wait while we process your audit request...
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-12">
                <div className="relative mb-8">
                  <div className="w-24 h-24 border-8 border-blue-100 rounded-full"></div>
                  <div className="w-24 h-24 border-8 border-blue-600 border-t-transparent rounded-full animate-spin absolute top-0"></div>
                </div>
                <p className="text-center text-muted-foreground mb-4">
                  Analyzing transaction data and generating audit report...
                </p>
                <Progress value={75} className="w-64 h-2" />
                <p className="text-sm text-muted-foreground mt-4">
                  This usually takes about 10 seconds
                </p>
              </div>
            </CardContent>
          </Card>
        );
      }
    }
    
    // Admin flow: Identifier Input
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Enter {selectedProduct.identifierLabel}
          </CardTitle>
          <CardDescription>
            Provide the {selectedProduct.identifierLabel.toLowerCase()} to fetch audit details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleIdentifierSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="identifier">{selectedProduct.identifierLabel}</Label>
              <Input
                id="identifier"
                type="text"
                placeholder={`Enter ${selectedProduct.identifierLabel.toLowerCase()}`}
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                disabled={isValidating}
              />
            </div>

            {error && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Demo Identifiers:</strong>
              </p>
              <p className="text-xs text-blue-600 mt-1">
                PAY_123456789 • TOK_987654321 • ORD_456789123
              </p>
              <p className="text-xs text-blue-600 mt-1">
                <strong>Failed Payments:</strong> PAY_FAILED_001 • PAY_FAILED_002 • PAY_FAILED_003
              </p>
            </div>

            <div className="flex justify-between pt-4">
              <Button type="button" variant="outline" onClick={() => setCurrentStep(1)}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <Button type="submit" disabled={isValidating}>
                {isValidating && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                {isValidating ? 'Validating...' : 'Validate & Fetch Details'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    );
  };

  const renderStep3 = () => {
    // Check if payment failed
    if (auditDetails && auditDetails.status === 'failed') {
      return renderFailureScreen();
    }
    
    // Merchant flow: Show detailed report
    if (loginSource === 'merchant') {
      return renderMerchantReport();
    }
    
    // Admin flow: Show validation details
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Validation Successful
          </CardTitle>
          <CardDescription>
            Details fetched for {auditDetails?.identifier}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {auditDetails && (
            <>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label>Identifier</Label>
                  <p className="mt-1">{auditDetails.identifier}</p>
                </div>
                <div>
                  <Label>Status</Label>
                  <p className="mt-1">
                    <Badge variant={auditDetails.status === 'completed' || auditDetails.status === 'active' ? 'default' : 'secondary'}>
                      {auditDetails.status}
                    </Badge>
                  </p>
                </div>
                {auditDetails.transactionAmount && (
                  <div>
                    <Label>Amount</Label>
                    <p className="mt-1">{auditDetails.currency} {auditDetails.transactionAmount}</p>
                  </div>
                )}
                <div>
                  <Label>Timestamp</Label>
                  <p className="mt-1">{new Date(auditDetails.timestamp).toLocaleString()}</p>
                </div>
              </div>

              <Separator />

              <div>
                <Label>Metadata</Label>
                <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                  <pre className="text-sm overflow-x-auto">
                    {JSON.stringify(auditDetails.metadata, null, 2)}
                  </pre>
                </div>
              </div>
            </>
          )}

          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={() => setCurrentStep(2)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <Button onClick={handleDetailsConfirm}>
              Proceed to Checklist Generation
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderFailureScreen = () => {
    if (!auditDetails || !auditDetails.failureDetails) return null;

    const { errorCode, errorReason, errorDescription, nextSteps } = auditDetails.failureDetails;

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <XCircle className="h-6 w-6 text-red-600" />
            Payment Failed
          </CardTitle>
          <CardDescription>
            The payment identifier {auditDetails.identifier} is in a failed state
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Transaction Details */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label>Payment ID</Label>
                <p className="mt-1">{auditDetails.identifier}</p>
              </div>
              <div>
                <Label>Status</Label>
                <p className="mt-1">
                  <Badge className="bg-red-600 text-white">
                    Failed
                  </Badge>
                </p>
              </div>
              {auditDetails.transactionAmount && (
                <div>
                  <Label>Amount</Label>
                  <p className="mt-1">{auditDetails.currency} {auditDetails.transactionAmount}</p>
                </div>
              )}
              <div>
                <Label>Timestamp</Label>
                <p className="mt-1">{new Date(auditDetails.timestamp).toLocaleString()}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Error Code */}
          <div>
            <h4 className="mb-3 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              Error Code
            </h4>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <p className="font-mono">{errorCode}</p>
            </div>
          </div>

          {/* Error Reason */}
          <div>
            <h4 className="mb-3">Reason</h4>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <p>{errorReason}</p>
            </div>
          </div>

          {/* Error Description */}
          <div>
            <h4 className="mb-3">Description</h4>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <p className="text-sm text-gray-700">{errorDescription}</p>
            </div>
          </div>

          <Separator />

          {/* Next Steps */}
          <div>
            <h4 className="mb-3 flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-blue-600" />
              Recommended Next Steps
            </h4>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <ol className="space-y-3 text-sm">
                {nextSteps.map((step, index) => (
                  <li key={index} className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs">
                      {index + 1}
                    </span>
                    <span className="text-blue-900 pt-0.5">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {/* Additional Payment Metadata */}
          {auditDetails.metadata && (
            <>
              <Separator />
              <div>
                <h4 className="mb-3">Payment Metadata</h4>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {auditDetails.metadata.cardBrand && (
                      <div>
                        <Label>Card Brand</Label>
                        <p className="mt-1 capitalize">{auditDetails.metadata.cardBrand}</p>
                      </div>
                    )}
                    {auditDetails.metadata.lastFour && (
                      <div>
                        <Label>Last 4 Digits</Label>
                        <p className="mt-1">••••{auditDetails.metadata.lastFour}</p>
                      </div>
                    )}
                    {auditDetails.metadata.paymentMethod && (
                      <div>
                        <Label>Payment Method</Label>
                        <p className="mt-1 capitalize">{auditDetails.metadata.paymentMethod.replace('_', ' ')}</p>
                      </div>
                    )}
                    {auditDetails.metadata.attemptCount !== undefined && (
                      <div>
                        <Label>Attempt Count</Label>
                        <p className="mt-1">{auditDetails.metadata.attemptCount}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Contact Support */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-yellow-900">
                  <strong>Need Help?</strong>
                </p>
                <p className="text-sm text-yellow-800 mt-1">
                  If you need assistance resolving this payment failure, please contact your account manager at {merchantData.accountManager.email}
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={() => { setCurrentStep(loginSource === 'admin' ? 2 : 1); setAuditDetails(null); setIdentifier(''); }}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              {loginSource === 'admin' ? 'Try Another Payment' : 'Back to Dashboard'}
            </Button>
            <Button onClick={() => window.location.reload()}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Start New Audit
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderMerchantReport = () => {
    if (!auditDetails) return null;

    const checklist = generateChecklist(selectedProduct, auditDetails, missingFeatures);
    const implementedCount = checklist.filter(item => item.status === 'implemented').length;
    const notImplementedCount = checklist.filter(item => item.status === 'not-implemented').length;
    const recommendedCount = checklist.filter(item => item.status === 'recommended').length;

    const handleDownload = () => {
      const reportContent = `
AUDIT REPORT
============

Merchant: ${merchantData.companyName}
MID: ${merchantData.mid}
Product: ${selectedProduct.name}
Audit Date: ${new Date().toLocaleString()}
Identifier: ${auditDetails.identifier}

SUMMARY
-------
Total Checks: ${checklist.length}
Implemented: ${implementedCount}
Not Implemented: ${notImplementedCount}
Recommended: ${recommendedCount}

DETAILED CHECKLIST
------------------
${checklist.map((item, idx) => `
${idx + 1}. ${item.requirement}
   Category: ${item.category}
   Status: ${item.status.toUpperCase()}
   ${item.suggestion ? `Suggestion: ${item.suggestion}` : ''}
`).join('\n')}

---
Generated by Product Audit Tool
      `;

      const blob = new Blob([reportContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `audit-report-${merchantData.mid}-${new Date().getTime()}.txt`;
      a.click();
      URL.revokeObjectURL(url);
    };

    if (showFullReport) {
      return (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              Detailed Audit Report
            </CardTitle>
            <CardDescription>
              Complete compliance audit report with explanations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Report Header */}
            <div className="border-b pb-4">
              <h3 className="mb-4">Report Information</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Merchant</p>
                  <p>{merchantData.companyName}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Merchant ID</p>
                  <p>{merchantData.mid}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Product</p>
                  <p>{selectedProduct.name}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Audit Date</p>
                  <p>{new Date().toLocaleString()}</p>
                </div>
              </div>
            </div>

            {/* Understanding the Report */}
            <div className="bg-blue-50 p-4 rounded-lg space-y-3">
              <h4 className="flex items-center gap-2">
                <Info className="h-4 w-4 text-blue-600" />
                Understanding Your Audit Report
              </h4>
              <p className="text-sm text-blue-900">
                This report evaluates your product implementation against compliance requirements and best practices.
              </p>
            </div>

            {/* Status Explanations */}
            <div className="space-y-3">
              <h4>Status Definitions</h4>
              <div className="space-y-2">
                <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-green-900"><strong>Implemented</strong></p>
                    <p className="text-xs text-green-700">This requirement is properly configured and working as expected. No action needed.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg border border-red-200">
                  <XCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-red-900"><strong>Not Implemented</strong></p>
                    <p className="text-xs text-red-700">This is a mandatory requirement that is currently missing. Immediate action required to ensure compliance.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-yellow-900"><strong>Recommended</strong></p>
                    <p className="text-xs text-yellow-700">This is a best practice feature that would enhance your implementation. Consider implementing for improved performance and user experience.</p>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Summary Statistics */}
            <div>
              <h4 className="mb-4">Compliance Summary</h4>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="text-3xl text-green-600">{implementedCount}</div>
                  <div className="text-sm text-green-800 mt-1">Implemented</div>
                  <p className="text-xs text-green-600 mt-2">Requirements met</p>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
                  <div className="text-3xl text-red-600">{notImplementedCount}</div>
                  <div className="text-sm text-red-800 mt-1">Not Implemented</div>
                  <p className="text-xs text-red-600 mt-2">Action required</p>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="text-3xl text-yellow-600">{recommendedCount}</div>
                  <div className="text-sm text-yellow-800 mt-1">Recommended</div>
                  <p className="text-xs text-yellow-600 mt-2">Best practices</p>
                </div>
              </div>
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center text-sm">
                  <span>Overall Compliance Rate</span>
                  <span className="font-semibold">
                    {Math.round((implementedCount / checklist.length) * 100)}%
                  </span>
                </div>
                <Progress 
                  value={(implementedCount / checklist.length) * 100} 
                  className="h-2 mt-2" 
                />
              </div>
            </div>

            <Separator />

            {/* Detailed Checklist */}
            <div>
              <h4 className="mb-4">Detailed Requirements Analysis</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Below is a comprehensive breakdown of each requirement, its current status, and recommended actions.
              </p>
              <div className="space-y-4">
                {checklist.map((item, index) => (
                  <div key={item.id} className={`p-4 rounded-lg border ${
                    item.status === 'implemented' ? 'bg-green-50 border-green-200' :
                    item.status === 'not-implemented' ? 'bg-red-50 border-red-200' :
                    'bg-yellow-50 border-yellow-200'
                  }`}>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <span className="text-sm font-semibold text-muted-foreground">
                          #{index + 1}
                        </span>
                        <div className="flex-1">
                          <p className="mb-2">{item.requirement}</p>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {item.category}
                            </Badge>
                            <Badge className={`text-xs ${
                              item.status === 'implemented' ? 'bg-green-600' :
                              item.status === 'not-implemented' ? 'bg-red-600' :
                              'bg-yellow-600'
                            }`}>
                              {item.status === 'implemented' ? 'Implemented' :
                               item.status === 'not-implemented' ? 'Not Implemented' :
                               'Recommended'}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      
                      {item.explanation && (
                        <div className={`p-3 rounded ml-8 ${
                          item.status === 'implemented' ? 'bg-green-100' :
                          item.status === 'not-implemented' ? 'bg-red-100' :
                          'bg-yellow-100'
                        }`}>
                          <p className="text-sm">{item.explanation}</p>
                        </div>
                      )}
                      
                      {item.suggestion && (
                        <div className={`p-3 rounded ml-8 ${
                          item.status === 'implemented' ? 'bg-green-100' :
                          item.status === 'not-implemented' ? 'bg-red-100' :
                          'bg-yellow-100'
                        }`}>
                          <p className="text-xs mb-1">
                            <strong>{item.status === 'not-implemented' ? 'Action Required:' : 'Recommendation:'}</strong>
                          </p>
                          <p className="text-sm">{item.suggestion}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Next Steps */}
            {notImplementedCount > 0 && (
              <>
                <Separator />
                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                  <h4 className="flex items-center gap-2 mb-3 text-red-900">
                    <AlertTriangle className="h-4 w-4" />
                    Immediate Action Required
                  </h4>
                  <p className="text-sm text-red-800 mb-3">
                    You have {notImplementedCount} mandatory requirement{notImplementedCount > 1 ? 's' : ''} that need{notImplementedCount === 1 ? 's' : ''} to be implemented for full compliance.
                  </p>
                  <p className="text-sm text-red-800">
                    Please contact your account manager ({merchantData.accountManager.name} at {merchantData.accountManager.email}) for assistance with implementing these requirements.
                  </p>
                </div>
              </>
            )}

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => setShowFullReport(false)}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Summary
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => window.print()}>
                  <Eye className="h-4 w-4 mr-2" />
                  Print Report
                </Button>
                <Button onClick={handleDownload}>
                  <Download className="h-4 w-4 mr-2" />
                  Download Report
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Audit Report Ready
          </CardTitle>
          <CardDescription>
            Your audit report has been generated successfully
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Summary */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="text-2xl text-green-600">{implementedCount}</div>
              <div className="text-sm text-green-800">Implemented</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
              <div className="text-2xl text-red-600">{notImplementedCount}</div>
              <div className="text-sm text-red-800">Not Implemented</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="text-2xl text-yellow-600">{recommendedCount}</div>
              <div className="text-sm text-yellow-800">Recommended</div>
            </div>
          </div>

          <Separator />

          {/* Checklist Preview */}
          <div>
            <h4 className="mb-4">Audit Checklist Preview</h4>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {checklist.map((item) => (
                <div key={item.id} className={`p-4 rounded-lg border ${
                  item.status === 'implemented' ? 'bg-green-50 border-green-200' :
                  item.status === 'not-implemented' ? 'bg-red-50 border-red-200' :
                  'bg-yellow-50 border-yellow-200'
                }`}>
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <Badge className={`text-xs ${
                        item.status === 'implemented' ? 'bg-green-600' :
                        item.status === 'not-implemented' ? 'bg-red-600' :
                        'bg-yellow-600'
                      }`}>
                        {item.status === 'implemented' ? 'Implemented' :
                         item.status === 'not-implemented' ? 'Not Implemented' :
                         'Recommended'}
                      </Badge>
                      <div className="flex-1">
                        <p className="mb-2">{item.requirement}</p>
                      </div>
                    </div>
                    
                    {item.explanation && (
                      <div className={`p-3 rounded ${
                        item.status === 'implemented' ? 'bg-green-100' :
                        item.status === 'not-implemented' ? 'bg-red-100' :
                        'bg-yellow-100'
                      }`}>
                        <p className="text-sm">{item.explanation}</p>
                      </div>
                    )}
                    
                    {item.suggestion && (
                      <div className={`p-3 rounded ${
                        item.status === 'implemented' ? 'bg-green-100' :
                        item.status === 'not-implemented' ? 'bg-red-100' :
                        'bg-yellow-100'
                      }`}>
                        <p className="text-xs mb-1">
                          <strong>{item.status === 'not-implemented' ? 'Action Required:' : 'Recommendation:'}</strong>
                        </p>
                        <p className="text-sm">{item.suggestion}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={onBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <div className="flex gap-2">
              <Button onClick={() => setShowFullReport(true)}>
                <Eye className="h-4 w-4 mr-2" />
                View Full Report
              </Button>
              <Button onClick={handleDownload}>
                <Download className="h-4 w-4 mr-2" />
                Download Report
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8">
        {renderStepIndicator()}
        
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
        {currentStep >= 4 && loginSource === 'admin' && auditDetails && (
          <ChecklistGeneration
            merchantData={merchantData}
            selectedProduct={selectedProduct}
            auditDetails={auditDetails}
            missingFeatures={missingFeatures}
            onBack={() => setCurrentStep(3)}
            currentStep={currentStep}
            onStepChange={setCurrentStep}
            loginSource={loginSource}
          />
        )}
      </div>
    </div>
  );
}