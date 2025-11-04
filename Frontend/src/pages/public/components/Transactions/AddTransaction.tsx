import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateTransaction, useInvestmentSummaries } from '@/api';
import { transactionService } from '@/api/services';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TRANSACTION_TYPES } from '@/constants/appConstants';
import {
  Loader2,
  ArrowLeft,
  Save,
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Calculator,
} from 'lucide-react';
import type {
  CreateTransactionRequest,
  TransactionPreview,
  TransactionPreviewResult,
} from '@/types';

const AddTransaction = () => {
  const navigate = useNavigate();
  const createTransactionMutation = useCreateTransaction();
  const { data: investmentsData, isLoading: loadingInvestments } =
    useInvestmentSummaries();

  const investments = investmentsData?.data || [];

  // Form state
  const [formData, setFormData] = useState<CreateTransactionRequest>({
    investmentId: 0,
    type: '',
    quantity: 0,
    pricePerUnit: 0,
    transactionDate: new Date().toISOString().split('T')[0],
    notes: '',
  });

  // Preview state
  const [preview, setPreview] = useState<TransactionPreviewResult | null>(null);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [previewError, setPreviewError] = useState<string>('');

  // Form errors
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Get selected investment details
  const selectedInvestment = investments.find(
    (inv: any) => inv.id === formData.investmentId
  );

  // Auto-calculate preview when relevant fields change
  useEffect(() => {
    console.log('Preview useEffect triggered:', {
      investmentId: formData.investmentId,
      type: formData.type,
      quantity: formData.quantity,
      pricePerUnit: formData.pricePerUnit,
    });

    if (
      formData.investmentId &&
      formData.type &&
      formData.quantity > 0 &&
      formData.pricePerUnit > 0
    ) {
      console.log('Calling calculatePreview...');
      calculatePreview();
    } else {
      console.log('Conditions not met, clearing preview');
      setPreview(null);
      setPreviewError('');
    }
  }, [
    formData.investmentId,
    formData.type,
    formData.quantity,
    formData.pricePerUnit,
  ]);

  // Calculate transaction preview
  const calculatePreview = async () => {
    try {
      setLoadingPreview(true);
      setPreviewError('');

      const previewData: TransactionPreview = {
        investmentId: formData.investmentId,
        type: formData.type,
        quantity: formData.quantity,
        pricePerUnit: formData.pricePerUnit,
      };

      const response = await transactionService.preview(previewData);
      console.log('Preview response:', response);

      // Check if response has the expected structure
      if (response && response.data) {
        setPreview(response.data);
      } else {
        setPreview(null);
        setPreviewError('Invalid preview data received');
      }
    } catch (error: any) {
      console.error('Preview error:', error);
      console.error('Error details:', error.response?.data);
      setPreviewError(
        error.response?.data?.message ||
          error.message ||
          'Unable to calculate preview. Please check your values.'
      );
      setPreview(null);
    } finally {
      setLoadingPreview(false);
    }
  };

  // Handle input change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // Handle number input change
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value === '' ? 0 : parseFloat(value),
    }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // Handle select change
  const handleSelectChange = (name: string, value: string) => {
    if (name === 'investmentId') {
      setFormData((prev) => ({
        ...prev,
        [name]: parseInt(value),
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // Validate form
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.investmentId || formData.investmentId === 0) {
      errors.investmentId = 'Investment selection is required';
    }

    if (!formData.type) {
      errors.type = 'Transaction type is required';
    }

    if (!formData.quantity || formData.quantity <= 0) {
      errors.quantity = 'Quantity must be greater than 0';
    }

    if (!formData.pricePerUnit || formData.pricePerUnit <= 0) {
      errors.pricePerUnit = 'Price per unit must be greater than 0';
    }

    if (!formData.transactionDate) {
      errors.transactionDate = 'Transaction date is required';
    } else {
      const transactionDate = new Date(formData.transactionDate);
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      if (transactionDate > today) {
        errors.transactionDate = 'Transaction date cannot be in the future';
      }
    }

    // Additional validation for Sell transactions
    if (
      formData.type === 'Sell' &&
      selectedInvestment &&
      formData.quantity > selectedInvestment.quantity
    ) {
      errors.quantity = `Cannot sell more than owned (${selectedInvestment.quantity})`;
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const submitData: CreateTransactionRequest = {
      investmentId: formData.investmentId,
      type: formData.type,
      quantity: formData.quantity,
      pricePerUnit: formData.pricePerUnit,
      transactionDate: formData.transactionDate,
      notes: formData.notes || undefined,
    };

    createTransactionMutation.mutate(submitData, {
      onSuccess: () => {
        navigate('/transactions');
      },
    });
  };

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(value);
  };

  // Loading state for investments
  if (loadingInvestments) {
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <Loader2 className='h-8 w-8 animate-spin text-primary-500' />
      </div>
    );
  }

  // No investments state
  if (investments.length === 0) {
    return (
      <div className='space-y-6 p-6'>
        <div className='flex items-center gap-4'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => navigate('/transactions')}
            className='border-light-400'
          >
            <ArrowLeft className='mr-2 h-4 w-4' />
            Back
          </Button>
        </div>
        <Card className='border-light-400'>
          <CardContent className='pt-6'>
            <div className='flex flex-col items-center justify-center py-12 text-center'>
              <AlertCircle className='h-12 w-12 text-red-500 mb-4' />
              <h3 className='p-20-bold text-dark-900 mb-2'>
                No Active Investments
              </h3>
              <p className='p-16-regular text-dark-600 mb-4'>
                You need to have at least one active investment before you can
                add transactions.
              </p>
              <Button
                onClick={() => navigate('/investments/add')}
                className='bg-primary-500 hover:bg-primary-600'
              >
                Add Investment
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className='space-y-6 p-6'>
      {/* Header */}
      <div className='flex items-center gap-4'>
        <Button
          variant='outline'
          size='sm'
          onClick={() => navigate('/transactions')}
          className='border-light-400'
        >
          <ArrowLeft className='mr-2 h-4 w-4' />
          Back
        </Button>
        <div>
          <h1 className='p-32-bold text-dark-900'>Add Transaction</h1>
          <p className='p-16-regular text-dark-600 mt-1'>
            Record a new transaction for your investment
          </p>
        </div>
      </div>

      <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
        {/* Form Section */}
        <div className='lg:col-span-2'>
          <form onSubmit={handleSubmit}>
            <Card className='border-light-400 shadow-100'>
              <CardHeader>
                <div className='flex items-center gap-3'>
                  <div className='rounded-full bg-primary-100 p-3'>
                    <DollarSign className='h-6 w-6 text-primary-500' />
                  </div>
                  <div>
                    <CardTitle className='p-24-bold text-dark-900'>
                      Transaction Details
                    </CardTitle>
                    <CardDescription className='p-14-regular text-dark-600'>
                      Fill in the transaction information
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className='space-y-6'>
                {/* Investment Selection */}
                <div className='space-y-2'>
                  <Label
                    htmlFor='investmentId'
                    className='p-14-semibold text-dark-700'
                  >
                    Investment <span className='text-red-500'>*</span>
                  </Label>
                  <Select
                    value={formData.investmentId?.toString() || ''}
                    onValueChange={(value) =>
                      handleSelectChange('investmentId', value)
                    }
                  >
                    <SelectTrigger
                      className={`border-light-400 ${
                        formErrors.investmentId ? 'border-red-500' : ''
                      }`}
                    >
                      <SelectValue placeholder='Select an investment' />
                    </SelectTrigger>
                    <SelectContent>
                      {investments.map((investment: any) => (
                        <SelectItem
                          key={investment.id}
                          value={investment.id.toString()}
                        >
                          <div className='flex flex-col'>
                            <span className='font-semibold'>
                              {investment.name}
                            </span>
                            <span className='text-xs text-dark-500'>
                              {investment.type} • Qty: {investment.quantity}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formErrors.investmentId && (
                    <p className='p-12-regular text-red-500'>
                      {formErrors.investmentId}
                    </p>
                  )}
                  {selectedInvestment && (
                    <div className='bg-light-200 rounded-lg p-3 mt-2'>
                      <div className='grid grid-cols-2 gap-2 text-sm'>
                        <div>
                          <span className='text-dark-600'>
                            Current Quantity:
                          </span>
                          <span className='ml-2 font-semibold text-dark-900'>
                            {selectedInvestment.quantity}
                          </span>
                        </div>
                        <div>
                          <span className='text-dark-600'>Current Value:</span>
                          <span className='ml-2 font-semibold text-dark-900'>
                            {formatCurrency(selectedInvestment.currentValue)}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                  {/* Transaction Type */}
                  <div className='space-y-2'>
                    <Label
                      htmlFor='type'
                      className='p-14-semibold text-dark-700'
                    >
                      Transaction Type <span className='text-red-500'>*</span>
                    </Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value) =>
                        handleSelectChange('type', value)
                      }
                    >
                      <SelectTrigger
                        className={`border-light-400 ${
                          formErrors.type ? 'border-red-500' : ''
                        }`}
                      >
                        <SelectValue placeholder='Select type' />
                      </SelectTrigger>
                      <SelectContent>
                        {TRANSACTION_TYPES.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type === 'Buy' && 'Buy More'}
                            {type === 'Sell' && 'Partial Sell'}
                            {type === 'Update' && 'Update'}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {formErrors.type && (
                      <p className='p-12-regular text-red-500'>
                        {formErrors.type}
                      </p>
                    )}
                  </div>

                  {/* Transaction Date */}
                  <div className='space-y-2'>
                    <Label
                      htmlFor='transactionDate'
                      className='p-14-semibold text-dark-700'
                    >
                      Transaction Date <span className='text-red-500'>*</span>
                    </Label>
                    <Input
                      id='transactionDate'
                      name='transactionDate'
                      type='date'
                      value={formData.transactionDate}
                      onChange={handleChange}
                      max={new Date().toISOString().split('T')[0]}
                      className={`border-light-400 ${
                        formErrors.transactionDate ? 'border-red-500' : ''
                      }`}
                    />
                    {formErrors.transactionDate && (
                      <p className='p-12-regular text-red-500'>
                        {formErrors.transactionDate}
                      </p>
                    )}
                  </div>

                  {/* Quantity */}
                  <div className='space-y-2'>
                    <Label
                      htmlFor='quantity'
                      className='p-14-semibold text-dark-700'
                    >
                      Quantity <span className='text-red-500'>*</span>
                    </Label>
                    <Input
                      id='quantity'
                      name='quantity'
                      type='number'
                      step='0.00000001'
                      value={formData.quantity || ''}
                      onChange={handleNumberChange}
                      placeholder='e.g., 10'
                      className={`border-light-400 ${
                        formErrors.quantity ? 'border-red-500' : ''
                      }`}
                    />
                    {formErrors.quantity && (
                      <p className='p-12-regular text-red-500'>
                        {formErrors.quantity}
                      </p>
                    )}
                  </div>

                  {/* Price Per Unit */}
                  <div className='space-y-2'>
                    <Label
                      htmlFor='pricePerUnit'
                      className='p-14-semibold text-dark-700'
                    >
                      Price Per Unit <span className='text-red-500'>*</span>
                    </Label>
                    <Input
                      id='pricePerUnit'
                      name='pricePerUnit'
                      type='number'
                      step='0.01'
                      value={formData.pricePerUnit || ''}
                      onChange={handleNumberChange}
                      placeholder='e.g., 150.50'
                      className={`border-light-400 ${
                        formErrors.pricePerUnit ? 'border-red-500' : ''
                      }`}
                    />
                    {formErrors.pricePerUnit && (
                      <p className='p-12-regular text-red-500'>
                        {formErrors.pricePerUnit}
                      </p>
                    )}
                  </div>
                </div>

                {/* Total Amount Display */}
                {formData.quantity > 0 && formData.pricePerUnit > 0 && (
                  <div className='bg-primary-100 rounded-lg p-4'>
                    <div className='flex items-center justify-between'>
                      <span className='p-16-semibold text-dark-700'>
                        Total Amount:
                      </span>
                      <span className='p-24-bold text-primary-700'>
                        {formatCurrency(
                          formData.quantity * formData.pricePerUnit
                        )}
                      </span>
                    </div>
                  </div>
                )}

                {/* Notes */}
                <div className='space-y-2'>
                  <Label
                    htmlFor='notes'
                    className='p-14-semibold text-dark-700'
                  >
                    Notes (Optional)
                  </Label>
                  <textarea
                    id='notes'
                    name='notes'
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder='Add any additional notes about this transaction...'
                    rows={4}
                    className='w-full rounded-md border border-light-400 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500'
                  />
                </div>

                {/* Action Buttons */}
                <div className='flex items-center gap-4 pt-4 border-t border-light-400'>
                  <Button
                    type='button'
                    variant='outline'
                    onClick={() => navigate('/transactions')}
                    disabled={createTransactionMutation.isPending}
                    className='border-light-400'
                  >
                    Cancel
                  </Button>
                  <Button
                    type='submit'
                    disabled={createTransactionMutation.isPending}
                    className='bg-primary-500 hover:bg-primary-600'
                  >
                    {createTransactionMutation.isPending ? (
                      <>
                        <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                        Adding...
                      </>
                    ) : (
                      <>
                        <Save className='mr-2 h-4 w-4' />
                        Add Transaction
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </form>
        </div>

        {/* Preview Section */}
        <div className='lg:col-span-1'>
          <Card className='border-light-400 shadow-100 sticky top-6'>
            <CardHeader>
              <div className='flex items-center gap-3'>
                <Calculator className='h-5 w-5 text-primary-500' />
                <CardTitle className='p-18-bold text-dark-900'>
                  Transaction Impact
                </CardTitle>
              </div>
              <CardDescription className='p-12-regular text-dark-600'>
                Preview how this transaction will affect your investment
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              {loadingPreview ? (
                <div className='flex items-center justify-center py-8'>
                  <Loader2 className='h-6 w-6 animate-spin text-primary-500' />
                </div>
              ) : previewError ? (
                <div className='bg-red-100 border border-red-300 rounded-lg p-4'>
                  <div className='flex items-start gap-2'>
                    <AlertCircle className='h-5 w-5 text-red-500 shrink-0 mt-0.5' />
                    <p className='p-12-regular text-red-700'>{previewError}</p>
                  </div>
                </div>
              ) : preview && preview.isValid !== undefined ? (
                <>
                  {/* Validation Message */}
                  {!preview.isValid && preview.validationMessage && (
                    <div className='bg-red-100 border border-red-300 rounded-lg p-3 mb-4'>
                      <div className='flex items-start gap-2'>
                        <AlertCircle className='h-5 w-5 text-red-500 shrink-0 mt-0.5' />
                        <p className='p-12-regular text-red-700'>
                          {preview.validationMessage}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className='space-y-3'>
                    {/* Investment Name */}
                    <div className='bg-primary-100 rounded-lg p-3'>
                      <span className='p-14-semibold text-dark-700'>
                        {preview.investmentName}
                      </span>
                    </div>

                    {/* Current Value */}
                    <div className='flex items-center justify-between p-3 bg-light-200 rounded-lg'>
                      <span className='p-14-regular text-dark-600'>
                        Current Value:
                      </span>
                      <span className='p-16-semibold text-dark-900'>
                        {formatCurrency(preview.currentValue ?? 0)}
                      </span>
                    </div>

                    {/* Transaction Amount */}
                    <div className='flex items-center justify-between p-3 bg-light-200 rounded-lg'>
                      <span className='p-14-regular text-dark-600'>
                        Transaction Amount:
                      </span>
                      <span className='p-16-semibold text-dark-900'>
                        {formatCurrency(preview.transactionAmount ?? 0)}
                      </span>
                    </div>

                    {/* New Total Value */}
                    <div className='flex items-center justify-between p-3 bg-light-200 rounded-lg'>
                      <span className='p-14-regular text-dark-600'>
                        New Total Value:
                      </span>
                      <span className='p-16-semibold text-dark-900'>
                        {formatCurrency(preview.newTotalValue ?? 0)}
                      </span>
                    </div>

                    {/* Value Change */}
                    <div
                      className={`flex items-center justify-between p-3 rounded-lg ${
                        (preview.valueChange ?? 0) >= 0
                          ? 'bg-success-100'
                          : 'bg-red-100'
                      }`}
                    >
                      <span className='p-14-regular text-dark-700'>
                        Value Change:
                      </span>
                      <div className='flex items-center gap-1'>
                        {(preview.valueChange ?? 0) >= 0 ? (
                          <TrendingUp className='h-4 w-4 text-success-700' />
                        ) : (
                          <TrendingDown className='h-4 w-4 text-red-500' />
                        )}
                        <span
                          className={`p-16-semibold ${
                            (preview.valueChange ?? 0) >= 0
                              ? 'text-success-700'
                              : 'text-red-500'
                          }`}
                        >
                          {formatCurrency(Math.abs(preview.valueChange ?? 0))}
                          <span className='text-xs ml-1'>
                            ({preview.valueChangePercentage?.toFixed(2)}%)
                          </span>
                        </span>
                      </div>
                    </div>

                    {/* New Quantity and Average Price (for Update type) */}
                    {preview.newQuantity !== null &&
                      preview.newQuantity !== undefined && (
                        <div className='flex items-center justify-between p-3 bg-blue-100 rounded-lg'>
                          <span className='p-14-regular text-dark-600'>
                            New Quantity:
                          </span>
                          <span className='p-16-semibold text-dark-900'>
                            {preview.newQuantity.toLocaleString()}
                          </span>
                        </div>
                      )}

                    {preview.newAveragePricePerUnit !== null &&
                      preview.newAveragePricePerUnit !== undefined && (
                        <div className='flex items-center justify-between p-3 bg-blue-100 rounded-lg'>
                          <span className='p-14-regular text-dark-600'>
                            New Average Price:
                          </span>
                          <span className='p-16-semibold text-dark-900'>
                            {formatCurrency(preview.newAveragePricePerUnit)}
                          </span>
                        </div>
                      )}
                  </div>
                </>
              ) : (
                <div className='text-center py-8'>
                  <Calculator className='h-12 w-12 text-dark-300 mx-auto mb-3' />
                  <p className='p-14-regular text-dark-600'>
                    Fill in the transaction details to see the impact preview
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AddTransaction;
