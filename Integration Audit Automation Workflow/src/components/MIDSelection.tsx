import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { MerchantData, ChildMID } from '../types/audit';
import { Building2, Mail, ArrowRight, Tag } from 'lucide-react';

interface MIDSelectionProps {
  parentData: MerchantData;
  onMIDSelect: (childMID: ChildMID) => void;
  onLogout: () => void;
}

export function MIDSelection({ parentData, onMIDSelect, onLogout }: MIDSelectionProps) {
  const childMIDs = parentData.childMIDs || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="border-b bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Building2 className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-xl">Select Merchant ID to Audit</h1>
                <p className="text-sm text-muted-foreground">
                  {parentData.companyName}
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
        <div className="mb-6">
          <h2 className="mb-2">Available Merchant IDs</h2>
          <p className="text-muted-foreground">
            Select the MID you want to audit. {childMIDs.length} {childMIDs.length === 1 ? 'MID' : 'MIDs'} available under this account.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {childMIDs.map((childMID) => {
            return (
              <Card key={childMID.mid} className="relative overflow-hidden hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-blue-600" />
                    {childMID.mid}
                  </CardTitle>
                  <CardDescription>
                    {childMID.businessName}
                  </CardDescription>
                </CardHeader>
<CardContent className="space-y-4">
                  <div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                      <Tag className="h-4 w-4" />
                      MCC
                    </div>
                    <Badge variant="outline" className="text-sm">
                      {childMID.mcc}
                    </Badge>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                      <Mail className="h-4 w-4" />
                      Owner Email
                    </div>
                    <p className="text-sm">{childMID.ownerEmail}</p>
                  </div>

                  <div className="pt-2">
                    <Button
                      onClick={() => onMIDSelect(childMID)}
                      className="w-full"
                      size="sm"
                    >
                      Select MID
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
