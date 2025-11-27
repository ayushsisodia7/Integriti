import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Alert, AlertDescription } from './ui/alert';
import { Checkbox } from './ui/checkbox';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { MerchantData, Product, MissingFeature, AuditDetails, ChecklistItem } from '../types/audit';
import { generateChecklist } from '../data/mockData';
import { 
  ArrowLeft, 
  Loader2, 
  CheckCircle, 
  AlertTriangle,
  FileText,
  Mail,
  Send,
  Check,
  Clock,
  Lightbulb
} from 'lucide-react';

interface ChecklistGenerationProps {
  merchantData: MerchantData;
  selectedProduct: Product;
  auditDetails: AuditDetails;
  missingFeatures: MissingFeature[];
  onBack: () => void;
  currentStep: number;
  onStepChange: (step: number) => void;
  loginSource: 'admin' | 'merchant';
}

export function ChecklistGeneration({ 
  merchantData, 
  selectedProduct, 
  auditDetails, 
  missingFeatures,
  onBack,
  currentStep,
  onStepChange,
  loginSource
}: ChecklistGenerationProps) {
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [emailBody, setEmailBody] = useState('');

  useEffect(() => {
    if (currentStep === 4) {
      generateAuditChecklist();
    }
  }, [currentStep]);

  const generateAuditChecklist = async () => {
    setIsGenerating(true);
    
    // Simulate checklist generation
    setTimeout(() => {
      const generatedChecklist = generateChecklist(selectedProduct, auditDetails, missingFeatures);
      setChecklist(generatedChecklist);
      setIsGenerating(false);
      
      // Auto-generate email body
      const emailContent = generateEmailBody(generatedChecklist);
      setEmailBody(emailContent);
    }, 3000);
  };

  const generateEmailBody = (checklistItems: ChecklistItem[]) => {
    const implementedCount = checklistItems.filter(item => item.status === 'implemented').length;
    const notImplementedCount = checklistItems.filter(item => item.status === 'not-implemented').length;
    const recommendedCount = checklistItems.filter(item => item.status === 'recommended').length;

    return `Subject: Product Audit Report - ${selectedProduct.name} (${merchantData.mid})

Dear ${merchantData.accountManager.name},

Please find below the audit report for ${merchantData.companyName} (${merchantData.mid}) regarding their ${selectedProduct.name} implementation.

AUDIT SUMMARY:
- Product: ${selectedProduct.name}
- Audit Identifier: ${auditDetails.identifier}
- Audit Date: ${new Date().toLocaleDateString()}
- Total Checks: ${checklistItems.length}
- Implemented: ${implementedCount}
- Not Implemented: ${notImplementedCount}
- Recommended: ${recommendedCount}

${missingFeatures.length > 0 ? `
MISSING FEATURES (${missingFeatures.length}):
${missingFeatures.map(f => `- ${f.feature} (${f.impact} Impact): ${f.description}`).join('\n')}
` : ''}

DETAILED CHECKLIST:
${checklistItems.map(item => `
${item.status === 'implemented' ? '✅' : item.status === 'not-implemented' ? '❌' : '⚠️'} ${item.requirement}
   Category: ${item.category}
   Status: ${item.status.toUpperCase()}
   ${item.suggestion ? `   Suggestion: ${item.suggestion}` : ''}
   ${item.autoPopulated ? '   (Auto-populated from audit data)' : ''}
`).join('\n')}

Please review and follow up with the merchant as needed.

Best regards,
Product Audit System`;
  };

  const handleSendEmail = async () => {
    setIsSendingEmail(true);
    
    // Simulate email sending
    setTimeout(() => {
      setIsSendingEmail(false);
      setEmailSent(true);
      onStepChange(5);
    }, 2000);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'implemented':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'not-implemented':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'recommended':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'implemented':
        return 'bg-green-50 border-green-200';
      case 'not-implemented':
        return 'bg-red-50 border-red-200';
      case 'recommended':
        return 'bg-yellow-50 border-yellow-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'implemented':
        return 'bg-green-600 text-white';
      case 'not-implemented':
        return 'bg-red-600 text-white';
      case 'recommended':
        return 'bg-yellow-600 text-white';
      default:
        return 'bg-gray-600 text-white';
    }
  };

  if (currentStep === 4) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Generating Audit Checklist
          </CardTitle>
          <CardDescription>
            Auto-populating checklist based on fetched audit details and product requirements
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isGenerating ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-4" />
              <p className="text-center text-muted-foreground mb-2">
                Analyzing audit data and generating checklist...
              </p>
              <div className="w-64">
                <Progress value={85} className="h-2" />
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Summary Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="text-2xl text-green-600">{checklist.filter(item => item.status === 'implemented').length}</div>
                  <div className="text-sm text-green-800">Implemented</div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
                  <div className="text-2xl text-red-600">{checklist.filter(item => item.status === 'not-implemented').length}</div>
                  <div className="text-sm text-red-800">Not Implemented</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="text-2xl text-yellow-600">{checklist.filter(item => item.status === 'recommended').length}</div>
                  <div className="text-sm text-yellow-800">Recommended</div>
                </div>
              </div>

              {/* Checklist Items */}
              <div className="space-y-4">
                <h4 className="flex items-center gap-2">
                  Generated Checklist ({checklist.length} items)
                </h4>
                
                {checklist.map((item) => (
                  <div key={item.id} className={`p-4 rounded-lg border ${getStatusColor(item.status)}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {getStatusIcon(item.status)}
                          <h5>{item.requirement}</h5>
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="secondary" className="text-xs">
                            {item.category}
                          </Badge>
                          <Badge className={`text-xs ${getStatusBadgeClass(item.status)}`}>
                            {item.status === 'implemented' ? 'Implemented' :
                             item.status === 'not-implemented' ? 'Not Implemented' :
                             'Recommended'}
                          </Badge>
                        </div>
                        {item.suggestion && (
                          <div className="flex items-start gap-2 mt-2 p-2 bg-blue-50 rounded">
                            <Lightbulb className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-blue-800">{item.suggestion}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={onBack}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Details
                </Button>
                <Button onClick={() => onStepChange(5)}>
                  Proceed to Email Confirmation
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  if (currentStep === 5) {
    const recipient1 = loginSource === 'admin' 
      ? { label: 'Account Manager', name: merchantData.accountManager.name, email: merchantData.accountManager.email }
      : { label: 'Account Manager', name: merchantData.accountManager.name, email: merchantData.accountManager.email };
    
    const recipient2 = loginSource === 'admin'
      ? { label: 'Integration Team', name: 'Integration Team', email: 'integrations-team@razorpay.com' }
      : { label: 'Merchant Owner', name: merchantData.companyName, email: merchantData.email };

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Email Confirmation
          </CardTitle>
          <CardDescription>
            Send audit report to {recipient1.label} and {recipient2.label}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {!emailSent ? (
            <>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label>{recipient1.label}</Label>
                  <p className="mt-1">{recipient1.name}</p>
                  <p className="text-sm text-muted-foreground">{recipient1.email}</p>
                </div>
                <div>
                  <Label>{recipient2.label}</Label>
                  <p className="mt-1">{recipient2.name}</p>
                  <p className="text-sm text-muted-foreground">{recipient2.email}</p>
                </div>
              </div>

              <div>
                <Label htmlFor="emailBody">Email Content</Label>
                <Textarea
                  id="emailBody"
                  value={emailBody}
                  onChange={(e) => setEmailBody(e.target.value)}
                  rows={20}
                  className="mt-2 font-mono text-sm"
                />
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => onStepChange(4)}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Checklist
                </Button>
                <Button onClick={handleSendEmail} disabled={isSendingEmail}>
                  {isSendingEmail ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Send Audit Report
                    </>
                  )}
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <Check className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl mb-2">Audit Report Sent Successfully!</h3>
              <p className="text-muted-foreground mb-6">
                The audit report has been sent to both the Account Manager and merchant owner.
              </p>
              
              <div className="bg-green-50 p-4 rounded-lg mb-6">
                <h4 className="text-green-800 mb-2">Email Recipients:</h4>
                <div className="text-sm text-green-700">
                  <p>• {recipient1.name} ({recipient1.email})</p>
                  <p>• {recipient2.name} ({recipient2.email})</p>
                </div>
              </div>

              <div className="flex justify-center gap-4">
                <Button variant="outline" onClick={() => window.location.reload()}>
                  Start New Audit
                </Button>
                <Button onClick={() => onStepChange(4)}>
                  View Checklist Again
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return null;
}