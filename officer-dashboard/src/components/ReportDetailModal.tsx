import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, MapPin, FileText, AlertCircle } from "lucide-react";
import { updateReportStatus } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

interface Report {
  _id: string;
  id: string;
  violationType: string;
  aiConfidence: number;
  zone: string;
  timestamp: string;
  status: "Pending" | "Verified" | "Rejected";
  thumbnail: string;
  vehicleNumber?: string;
  location?: string;
  fineAmount?: number;
}

interface ReportDetailModalProps {
  report: Report;
  isOpen: boolean;
  onClose: () => void;
  onStatusUpdate: () => void;
}

const ReportDetailModal = ({ report, isOpen, onClose, onStatusUpdate }: ReportDetailModalProps) => {
  const [step, setStep] = useState<'view' | 'verified'>('view');
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  const handleVerify = () => {
    // Move to verified step - show Generate Challan and Reject options
    setStep('verified');
  };

  const handleGenerateChallan = async () => {
    try {
      setIsUpdating(true);
      await updateReportStatus(report._id, 'Verified');
      
      toast({
        title: "Challan Generated",
        description: `Report ${report.id} has been verified and challan generated.`,
        variant: "default",
      });
      
      onStatusUpdate(); // Refresh the reports list
      onClose();
      setStep('view'); // Reset for next time
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update report status",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleReject = async () => {
    try {
      setIsUpdating(true);
      await updateReportStatus(report._id, 'Rejected');
      
      toast({
        title: "Report Rejected",
        description: `Report ${report.id} has been rejected.`,
        variant: "default",
      });
      
      onStatusUpdate(); // Refresh the reports list
      onClose();
      setStep('view'); // Reset for next time
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update report status",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleClose = () => {
    setStep('view'); // Reset step when closing
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Report Details: {report.id}</span>
            <Badge variant={report.status === "Pending" ? "secondary" : "default"}>
              {report.status}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <img 
              src={report.thumbnail} 
              alt="Violation evidence" 
              className="w-full h-64 object-cover rounded-lg border"
            />
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span>Location: {report.zone}</span>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Violation Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Type:</span>
                  <span className="font-medium">{report.violationType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Timestamp:</span>
                  <span className="font-medium">{report.timestamp}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Zone:</span>
                  <span className="font-medium">{report.zone}</span>
                </div>
                {report.vehicleNumber && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Vehicle:</span>
                    <span className="font-medium">{report.vehicleNumber}</span>
                  </div>
                )}
                {report.location && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Location:</span>
                    <span className="font-medium">{report.location}</span>
                  </div>
                )}
                {report.fineAmount && report.fineAmount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Fine Amount:</span>
                    <span className="font-medium">₹{report.fineAmount}</span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">AI Confidence Score</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Detection Accuracy</span>
                  <span className="text-sm font-bold text-primary">{report.aiConfidence}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-3">
                  <div 
                    className="bg-primary h-3 rounded-full transition-all"
                    style={{ width: `${report.aiConfidence}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="p-4 bg-muted/50 rounded-lg">
              <h3 className="font-semibold mb-2">Map Location</h3>
              <div className="w-full h-32 bg-muted rounded-lg flex items-center justify-center border">
                <MapPin className="w-8 h-8 text-muted-foreground" />
              </div>
            </div>
          </div>
        </div>

        {report.status === "Pending" && (
          <DialogFooter className="flex flex-col gap-3">
            {step === 'view' ? (
              // Step 1: Initial view - only Verify button
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <AlertCircle className="w-4 h-4" />
                  <span>Review the report details and verify</span>
                </div>
                <Button 
                  onClick={handleVerify} 
                  className="flex items-center gap-2"
                  disabled={isUpdating}
                >
                  <CheckCircle className="w-4 h-4" />
                  Verify Report
                </Button>
              </div>
            ) : (
              // Step 2: After verification - Generate Challan or Reject
              <div className="flex flex-col gap-3 w-full">
                <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <span className="text-sm font-medium text-green-700 dark:text-green-300">
                    Report verified. Choose an action:
                  </span>
                </div>
                <div className="flex gap-2 justify-end">
                  <Button 
                    variant="outline" 
                    onClick={handleReject} 
                    className="flex items-center gap-2"
                    disabled={isUpdating}
                  >
                    <XCircle className="w-4 h-4" />
                    Reject
                  </Button>
                  <Button 
                    onClick={handleGenerateChallan} 
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                    disabled={isUpdating}
                  >
                    <FileText className="w-4 h-4" />
                    {isUpdating ? 'Generating...' : 'Generate Challan'}
                  </Button>
                </div>
              </div>
            )}
          </DialogFooter>
        )}
        
        {report.status === "Verified" && (
          <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
            <span className="text-sm font-medium text-green-700 dark:text-green-300">
              This report has been verified and challan generated.
            </span>
          </div>
        )}
        
        {report.status === "Rejected" && (
          <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
            <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
            <span className="text-sm font-medium text-red-700 dark:text-red-300">
              This report has been rejected.
            </span>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ReportDetailModal;
