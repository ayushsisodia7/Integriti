import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { AlertCircle, Building2, User } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';

interface LoginFormProps {
  onLogin: (mid: string, source: 'admin' | 'merchant') => void;
}

export function LoginForm({ onLogin }: LoginFormProps) {
  const [adminMid, setAdminMid] = useState('');
  const [merchantCredentials, setMerchantCredentials] = useState({
    email: '',
    password: '',
    mid: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminMid.trim()) {
      setError('Please enter a valid MID');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    // Simulate API call
    setTimeout(() => {
      if (adminMid === 'MID123456' || adminMid === 'MID789012') {
        onLogin(adminMid, 'admin');
      } else {
        setError('Invalid MID. Please try MID123456 or MID789012 for demo.');
      }
      setIsLoading(false);
    }, 1000);
  };

  const handleMerchantLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!merchantCredentials.email || !merchantCredentials.password) {
      setError('Please enter both email and password');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    // Simulate API call
    setTimeout(() => {
      // Mock authentication - in real app, this would validate credentials
      let mid = '';
      if (merchantCredentials.email === 'owner@techcorp.com') {
        mid = 'MID123456';
      } else if (merchantCredentials.email === 'admin@ecommerceplus.com') {
        mid = 'MID789012';
      } else {
        setError('Invalid credentials. Try owner@techcorp.com or admin@ecommerceplus.com with any password.');
        setIsLoading(false);
        return;
      }
      
      onLogin(mid, 'merchant');
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <Building2 className="h-6 w-6" />
            Product Audit Tool
          </CardTitle>
          <CardDescription>
            Access the audit system via Admin Dashboard or Merchant Login
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="admin" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="admin" className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Admin Dashboard
              </TabsTrigger>
              <TabsTrigger value="merchant" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Merchant Login
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="admin" className="space-y-4">
              <form onSubmit={handleAdminLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="mid">Merchant ID (MID)</Label>
                  <Input
                    id="mid"
                    type="text"
                    placeholder="Enter MID (e.g., MID123456)"
                    value={adminMid}
                    onChange={(e) => setAdminMid(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Accessing...' : 'Access via Admin Dashboard'}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="merchant" className="space-y-4">
              <form onSubmit={handleMerchantLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={merchantCredentials.email}
                    onChange={(e) => setMerchantCredentials(prev => ({ ...prev, email: e.target.value }))}
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={merchantCredentials.password}
                    onChange={(e) => setMerchantCredentials(prev => ({ ...prev, password: e.target.value }))}
                    disabled={isLoading}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Signing In...' : 'Sign In to Dashboard'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
          
          {error && (
            <Alert className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Demo Credentials:</strong>
            </p>
            <p className="text-xs text-blue-600 mt-1">
              Admin: MID123456 or MID789012<br />
              Merchant: owner@techcorp.com or admin@ecommerceplus.com
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}