import { useState } from 'react';
import { LoginForm } from './components/LoginForm';
import { MIDSelection } from './components/MIDSelection';
import { Dashboard } from './components/Dashboard';
import { ProductAuditWizard } from './components/ProductAuditWizard';
import { MerchantData, Product, ChildMID } from './types/audit';
import { mockMerchantData } from './data/mockData';
import { Toaster } from './components/ui/sonner';

type AppState = 'login' | 'mid-selection' | 'dashboard' | 'audit';

export default function App() {
  const [appState, setAppState] = useState<AppState>('login');
  const [parentData, setParentData] = useState<MerchantData | null>(null);
  const [merchantData, setMerchantData] = useState<MerchantData | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [loginSource, setLoginSource] = useState<'admin' | 'merchant'>('admin');

  const handleLogin = (mid: string, source: 'admin' | 'merchant') => {
    const data = mockMerchantData[mid];
    if (data) {
      setParentData(data);
      setLoginSource(source);
      
      // If there are child MIDs, show selection screen
      if (data.childMIDs && data.childMIDs.length > 0) {
        setAppState('mid-selection');
      } else {
        // Otherwise go directly to dashboard
        setMerchantData(data);
        setAppState('dashboard');
      }
    }
  };

  const handleMIDSelect = (childMID: ChildMID) => {
    // Create merchant data from child MID
    const data: MerchantData = {
      mid: childMID.mid,
      companyName: childMID.businessName,
      email: childMID.ownerEmail,
      accountManager: childMID.accountManager,
      availableFeatures: childMID.availableFeatures,
      products: childMID.products
    };
    setMerchantData(data);
    setAppState('dashboard');
  };

  const handleLogout = () => {
    setParentData(null);
    setMerchantData(null);
    setSelectedProduct(null);
    setAppState('login');
  };

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
    setAppState('audit');
  };

  const handleBackToDashboard = () => {
    setSelectedProduct(null);
    setAppState('dashboard');
  };

  return (
    <>
      {appState === 'login' && <LoginForm onLogin={handleLogin} />}
      
      {appState === 'mid-selection' && parentData && (
        <MIDSelection
          parentData={parentData}
          onMIDSelect={handleMIDSelect}
          onLogout={handleLogout}
        />
      )}

      {appState === 'dashboard' && merchantData && (
        <Dashboard
          merchantData={merchantData}
          onProductSelect={handleProductSelect}
          onLogout={handleLogout}
          loginSource={loginSource}
        />
      )}

      {appState === 'audit' && merchantData && selectedProduct && (
        <ProductAuditWizard
          merchantData={merchantData}
          selectedProduct={selectedProduct}
          onBack={handleBackToDashboard}
          loginSource={loginSource}
        />
      )}
      
      <Toaster />
    </>
  );
}