import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Filter, Search } from "lucide-react";
import ReportDetailModal from "@/components/ReportDetailModal";
import { fetchReports, Report } from "@/services/api";

const Reports = () => {
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterZone, setFilterZone] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadReports = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchReports();
      setReports(data);
    } catch (error: any) {
      console.error('Error loading reports:', error);
      setError(error.message || 'Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         report.violationType.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesZone = filterZone === "all" || report.zone.toLowerCase().includes(filterZone.replace('zone-', ''));
    const matchesType = filterType === "all" || report.violationType.toLowerCase().includes(filterType);
    return matchesSearch && matchesZone && matchesType;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Verified": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "Rejected": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default: return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Reports</h1>
        <p className="text-muted-foreground mt-1">Review and manage traffic violation reports</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search reports..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={filterZone} onValueChange={setFilterZone}>
              <SelectTrigger>
                <SelectValue placeholder="All Zones" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Zones</SelectItem>
                <SelectItem value="zone-a">Zone A</SelectItem>
                <SelectItem value="zone-b">Zone B</SelectItem>
                <SelectItem value="zone-c">Zone C</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger>
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="helmet">No Helmet</SelectItem>
                <SelectItem value="signal">Signal Jump</SelectItem>
                <SelectItem value="triple">Triple Ride</SelectItem>
                <SelectItem value="wrong-way">Wrong Way</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">Reset Filters</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium">Report ID</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Preview</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Violation Type</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">AI Confidence</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Zone</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Timestamp</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-12 text-center">
                      <div className="flex flex-col items-center space-y-3">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        <span className="text-muted-foreground">Loading reports from database...</span>
                      </div>
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-12">
                      <div className="flex flex-col items-center space-y-4 text-center">
                        <div className="text-destructive text-4xl">⚠️</div>
                        <div>
                          <h3 className="font-semibold mb-1">Error Loading Reports</h3>
                          <p className="text-sm text-muted-foreground mb-3">{error}</p>
                          <Button onClick={loadReports} variant="outline" size="sm">
                            Retry
                          </Button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : filteredReports.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-muted-foreground">
                      {reports.length === 0 ? 'No reports in database' : 'No reports match your filters'}
                    </td>
                  </tr>
                ) : filteredReports.map((report) => (
                  <tr key={report.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 font-mono text-sm">{report.id}</td>
                    <td className="px-4 py-3">
                      <img src={report.thumbnail} alt="Report" className="w-12 h-12 rounded object-cover" />
                    </td>
                    <td className="px-4 py-3">{report.violationType}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-muted rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full transition-all"
                            style={{ width: `${report.aiConfidence}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">{report.aiConfidence}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">{report.zone}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{report.timestamp}</td>
                    <td className="px-4 py-3">
                      <Badge className={getStatusColor(report.status)} variant="secondary">
                        {report.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => setSelectedReport(report)}
                      >
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {selectedReport && (
        <ReportDetailModal
          report={selectedReport}
          isOpen={!!selectedReport}
          onClose={() => setSelectedReport(null)}
          onStatusUpdate={loadReports}
        />
      )}
    </div>
  );
};

export default Reports;
