import React, { useState, useEffect, useCallback } from 'react';
import { Search, Filter, RefreshCw, Receipt } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { useToast } from '../../hooks/use-toast';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const GATEWAY_LABELS = {
  razorpay: 'Razorpay',
  paypal: 'PayPal',
  tazapay: 'Tazapay',
};

const GATEWAY_COLORS = {
  razorpay: 'bg-blue-100 text-blue-800',
  paypal: 'bg-yellow-100 text-yellow-800',
  tazapay: 'bg-purple-100 text-purple-800',
};

export default function TransactionsPanel() {
  const { toast } = useToast();

  const [transactions, setTransactions] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState('');
  const [gatewayFilter, setGatewayFilter] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const LIMIT = 50;

  const fetchTransactions = useCallback(async (pg = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: pg, limit: LIMIT });
      if (gatewayFilter && gatewayFilter !== 'all') params.set('gateway', gatewayFilter);
      if (dateFrom) params.set('date_from', dateFrom);
      if (dateTo) params.set('date_to', dateTo);
      if (search.trim()) params.set('search', search.trim());

      const res = await fetch(`${BACKEND_URL}/api/payment-gateways/transactions?${params}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });

      if (!res.ok) throw new Error('Failed to fetch transactions');
      const data = await res.json();
      setTransactions(data.transactions || []);
      setTotal(data.total || 0);
      setPage(pg);
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to load transactions', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [gatewayFilter, dateFrom, dateTo, search, toast]);

  useEffect(() => {
    fetchTransactions(1);
  }, [gatewayFilter, dateFrom, dateTo]); // auto-fetch on filter change

  const handleSearch = (e) => {
    e.preventDefault();
    fetchTransactions(1);
  };

  const totalPages = Math.ceil(total / LIMIT);

  const totalAmount = transactions.reduce((sum, t) => sum + (t.amount || 0), 0);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-gray-600">Total Records</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{total}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-gray-600">Page Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">
              ${totalAmount.toFixed(2)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-gray-600">Razorpay</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-blue-600">
              {transactions.filter(t => t.gateway === 'razorpay').length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-gray-600">PayPal / Tazapay</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-yellow-600">
              {transactions.filter(t => t.gateway === 'paypal' || t.gateway === 'tazapay').length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Filter className="w-4 h-4" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-3 flex-wrap">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by App ID, email or Txn ID..."
                className="pl-10"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>

            {/* Gateway filter */}
            <Select value={gatewayFilter} onValueChange={setGatewayFilter}>
              <SelectTrigger className="w-full md:w-44">
                <SelectValue placeholder="All Gateways" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Gateways</SelectItem>
                <SelectItem value="razorpay">Razorpay</SelectItem>
                <SelectItem value="paypal">PayPal</SelectItem>
                <SelectItem value="tazapay">Tazapay</SelectItem>
              </SelectContent>
            </Select>

            {/* Date From */}
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-500">From</label>
              <Input
                type="date"
                className="w-40"
                value={dateFrom}
                onChange={e => setDateFrom(e.target.value)}
              />
            </div>

            {/* Date To */}
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-500">To</label>
              <Input
                type="date"
                className="w-40"
                value={dateTo}
                onChange={e => setDateTo(e.target.value)}
              />
            </div>

            <div className="flex items-end gap-2">
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                <Search className="w-4 h-4 mr-1" />
                Search
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setSearch('');
                  setGatewayFilter('all');
                  setDateFrom('');
                  setDateTo('');
                }}
              >
                Clear
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => fetchTransactions(page)}
                disabled={loading}
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Receipt className="w-4 h-4" />
            Transactions
            <span className="text-sm font-normal text-gray-500 ml-1">
              ({total} total{totalPages > 1 ? `, page ${page} of ${totalPages}` : ''})
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Application ID</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Gateway</TableHead>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-gray-500 py-8">
                      <div className="flex items-center justify-center gap-2">
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Loading...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : transactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-gray-500 py-8">
                      No transactions found
                    </TableCell>
                  </TableRow>
                ) : (
                  transactions.map((txn) => (
                    <TableRow key={txn.id}>
                      <TableCell className="text-sm text-gray-600 whitespace-nowrap">
                        {txn.created_at
                          ? new Date(txn.created_at).toLocaleString()
                          : '—'}
                      </TableCell>
                      <TableCell className="font-medium text-sm">
                        {txn.application_id || <span className="text-gray-400 italic">—</span>}
                      </TableCell>
                      <TableCell className="text-sm">
                        {txn.email || <span className="text-gray-400 italic">—</span>}
                      </TableCell>
                      <TableCell>
                        <Badge className={GATEWAY_COLORS[txn.gateway] || 'bg-gray-100 text-gray-800'}>
                          {GATEWAY_LABELS[txn.gateway] || txn.gateway}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs font-mono text-gray-600 max-w-[180px] truncate" title={txn.transaction_id}>
                        {txn.transaction_id || '—'}
                      </TableCell>
                      <TableCell className="font-semibold text-green-700">
                        {txn.currency} {Number(txn.amount).toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-800">
                          {txn.status?.toUpperCase() || 'SUCCESS'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between p-4 border-t">
              <p className="text-sm text-gray-500">
                Showing {(page - 1) * LIMIT + 1}–{Math.min(page * LIMIT, total)} of {total}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => fetchTransactions(page - 1)}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages}
                  onClick={() => fetchTransactions(page + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
