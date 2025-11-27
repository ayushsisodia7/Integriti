import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { MerchantData, Product } from '../types/audit';
import { Building2, CheckCircle, Clock, Package, Shield, User, Ticket, Loader2, Check } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { motion } from 'motion/react';

interface DashboardProps {
  merchantData: MerchantData;
  onProductSelect: (product: Product) => void;
  onLogout: () => void;
  loginSource: 'admin' | 'merchant';
}

export function Dashboard({ merchantData, onProductSelect, onLogout, loginSource }: DashboardProps) {
  const [raisingRequest, setRaisingRequest] = useState<string | null>(null);
  const [requestsRaised, setRequestsRaised] = useState<Set<string>>(new Set());

  const getFeatureCompletionPercentage = (product: Product) => {
    const availableRequiredFeatures = product.requiredFeatures.filter(
      feature => merchantData.availableFeatures.includes(feature)
    );
    return Math.round((availableRequiredFeatures.length / product.requiredFeatures.length) * 100);
  };

  const getStatusColor = (percentage: number) => {
    if (percentage >= 100) return 'text-green-600';
    if (percentage >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusIcon = (percentage: number) => {
    if (percentage >= 100) return <CheckCircle className="h-4 w-4 text-green-600" />;
    return <Clock className="h-4 w-4 text-yellow-600" />;
  };

  const handleRaiseRequest = async (productId: string, productName: string, missingFeatures: string[]) => {
    setRaisingRequest(productId);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const featuresList = missingFeatures.join(', ');
    toast.success(`Request raised for ${productName}`, {
      description: `A request has been created to enable: ${featuresList}. The team will reach out shortly.`
    });
    
    setRequestsRaised(prev => new Set(prev).add(productId));
    setRaisingRequest(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="border-b bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Building2 className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-xl">Product Audit Dashboard</h1>
                <p className="text-sm text-muted-foreground">
                  {merchantData.companyName} • {merchantData.mid}
                </p>
              </div>
            </div>
            <Button variant="outline" onClick={onLogout}>
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Merchant Info Card */}
          <Card className="md:col-span-2 lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Merchant Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Company</p>
                <p>{merchantData.companyName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Merchant ID</p>
                <p>{merchantData.mid}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p>{merchantData.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Account Manager</p>
                <p>{merchantData.accountManager.name}</p>
                <p className="text-xs text-muted-foreground">{merchantData.accountManager.email}</p>
              </div>
            </CardContent>
          </Card>

          {/* Available Features Card */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Available Features
              </CardTitle>
              <CardDescription>
                Features currently enabled for your merchant account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {merchantData.availableFeatures.map((feature) => (
                  <Badge key={feature} className="bg-green-100 text-green-800 border-green-200">
                    {feature}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Products Section */}
        <div className="mt-8">
          <div className="mb-6">
            <h2 className="flex items-center gap-2 mb-2">
              <Package className="h-5 w-5" />
              Available Products for Audit
            </h2>
            <p className="text-muted-foreground">
              Select a product to begin the audit process. Missing features will be highlighted.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {merchantData.products.map((product) => {
              const completionPercentage = getFeatureCompletionPercentage(product);
              const missingFeatures = product.requiredFeatures.filter(
                feature => !merchantData.availableFeatures.includes(feature)
              );

              return (
                <Card key={product.id} className="relative overflow-hidden">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {getStatusIcon(completionPercentage)}
                          {product.name}
                        </CardTitle>
                        <CardDescription className="mt-2">
                          {product.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm">Feature Readiness</span>
                        <span className={`text-sm ${getStatusColor(completionPercentage)}`}>
                          {completionPercentage}%
                        </span>
                      </div>
                      <Progress value={completionPercentage} className="h-2" />
                    </div>

                    <div>
                      <p className="text-sm mb-2">Available Features:</p>
                      <div className="flex flex-wrap gap-1">
                        {product.requiredFeatures
                          .filter(feature => merchantData.availableFeatures.includes(feature))
                          .map((feature) => (
                            <Badge
                              key={feature}
                              className="text-xs bg-green-100 text-green-800 border-green-200"
                            >
                              {feature}
                            </Badge>
                          ))}
                      </div>
                    </div>

                    {missingFeatures.length > 0 && (
                      <motion.div 
                        className="p-3 bg-red-50 rounded-lg"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <p className="text-sm text-red-800 mb-2">
                          {missingFeatures.length} feature{missingFeatures.length > 1 ? 's' : ''} missing:
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {missingFeatures.map((feature) => (
                            <Badge key={feature} className="text-xs bg-red-100 text-red-800 border-red-200">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {missingFeatures.length > 0 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRaiseRequest(product.id, product.name, missingFeatures)}
                        disabled={raisingRequest === product.id || requestsRaised.has(product.id)}
                        className={`w-full ${
                          requestsRaised.has(product.id)
                            ? 'border-green-300 bg-green-50 text-green-700 hover:bg-green-50'
                            : 'border-black text-black hover:bg-gray-100'
                        }`}
                      >
                        {raisingRequest === product.id ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Raising Request...
                          </>
                        ) : requestsRaised.has(product.id) ? (
                          <>
                            <Check className="h-4 w-4 mr-2" />
                            Request Raised
                          </>
                        ) : (
                          <>
                            <Ticket className="h-4 w-4 mr-2" />
                            Raise Request
                          </>
                        )}
                      </Button>
                    )}

                    <div className="pt-2">
                      <Button 
                        onClick={() => onProductSelect(product)} 
                        className="w-full"
                        size="sm"
                      >
                        Start Audit
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}