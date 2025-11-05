import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  useInvestment,
  useUpdateInvestment,
  usePortfolioSummaries,
} from '@/api';
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
import {
  INVESTMENT_TYPES,
  INVESTMENT_STATUSES,
} from '@/constants/appConstants';
import { Loader2, ArrowLeft, Save, Briefcase, AlertCircle } from 'lucide-react';
import type { UpdateInvestmentRequest } from '@/types';

const EditInvestment = () => {
  const navigate = useNavigate();
  const { investmentId: idParam } = useParams<{ investmentId: string }>();
  const investmentId = idParam ? parseInt(idParam) : 0;

  const {
    data: investmentData,
    isLoading: isLoadingInvestment,
    error: investmentError,
  } = useInvestment(investmentId);
  const updateInvestmentMutation = useUpdateInvestment();
  const { data: portfoliosData } = usePortfolioSummaries();

  const investment = investmentData?.data;
  const portfolios = portfoliosData?.data || [];

  const [formData, setFormData] = useState<UpdateInvestmentRequest>({
    name: '',
    type: '',
    status: 'Active',
    initialAmount: 0,
    quantity: undefined,
    averagePricePerUnit: undefined,
    purchaseDate: '',
    brokerPlatform: '',
    notes: '',
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (investment) {
      setFormData({
        name: investment.name,
        type: investment.type,
        status: investment.status,
        initialAmount: investment.initialAmount,
        quantity: investment.quantity,
        averagePricePerUnit: investment.averagePricePerUnit,
        purchaseDate: investment.purchaseDate.split('T')[0],
        brokerPlatform: investment.brokerPlatform || '',
        notes: investment.notes || '',
      });
    }
  }, [investment]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value === '' ? undefined : parseFloat(value),
    }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    if (name === 'portfolioId') {
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

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.name || formData.name.trim().length < 3) {
      errors.name = 'Investment name must be at least 3 characters';
    }

    if (!formData.type) {
      errors.type = 'Investment type is required';
    }

    if (!formData.status) {
      errors.status = 'Investment status is required';
    }

    if (!formData.initialAmount || formData.initialAmount <= 0) {
      errors.initialAmount = 'Initial amount must be greater than 0';
    }

    if (formData.quantity !== undefined && formData.quantity < 0) {
      errors.quantity = 'Quantity cannot be negative';
    }

    if (
      formData.averagePricePerUnit !== undefined &&
      formData.averagePricePerUnit < 0
    ) {
      errors.averagePricePerUnit = 'Average price per unit cannot be negative';
    }

    if (!formData.purchaseDate) {
      errors.purchaseDate = 'Purchase date is required';
    } else {
      const purchaseDate = new Date(formData.purchaseDate);
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      if (purchaseDate > today) {
        errors.purchaseDate = 'Purchase date cannot be in the future';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const submitData: UpdateInvestmentRequest = {
      ...formData,
      brokerPlatform: formData.brokerPlatform || undefined,
      notes: formData.notes || undefined,
    };

    updateInvestmentMutation.mutate(
      { id: investmentId, data: submitData },
      {
        onSuccess: () => {
          navigate('/investments');
        },
      }
    );
  };

  if (isLoadingInvestment) {
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <Loader2 className='h-8 w-8 animate-spin text-primary-500' />
      </div>
    );
  }

  if (investmentError || !investment) {
    return (
      <div className='space-y-6 p-6'>
        <div className='flex items-center gap-4'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => navigate('/investments')}
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
                Investment Not Found
              </h3>
              <p className='p-16-regular text-dark-600'>
                The investment you're looking for doesn't exist or you don't
                have permission to edit it.
              </p>
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
          onClick={() => navigate('/investments')}
          className='border-light-400'
        >
          <ArrowLeft className='mr-2 h-4 w-4' />
          Back
        </Button>
        <div>
          <h1 className='p-32-bold text-dark-900'>Edit Investment</h1>
          <p className='p-16-regular text-dark-600 mt-1'>
            Update the details of your investment
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <Card className='border-light-400 shadow-100'>
          <CardHeader>
            <div className='flex items-center gap-3'>
              <div className='rounded-full bg-primary-100 p-3'>
                <Briefcase className='h-6 w-6 text-primary-500' />
              </div>
              <div>
                <CardTitle className='p-24-bold text-dark-900'>
                  Investment Details
                </CardTitle>
                <CardDescription className='p-14-regular text-dark-600'>
                  Update the information about your investment
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className='space-y-6'>
            {/* Portfolio Info (Read-only) */}
            <div className='bg-light-200 rounded-lg p-4 border border-light-400'>
              <p className='p-14-semibold text-dark-700 mb-1'>Portfolio</p>
              <p className='p-16-regular text-dark-900'>
                {investment?.portfolioName || 'No Portfolio'}
              </p>
              <p className='p-12-regular text-dark-500 mt-1'>
                Portfolio cannot be changed after investment creation
              </p>
            </div>

            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
              {/* Investment Name */}
              <div className='space-y-2'>
                <Label htmlFor='name' className='p-14-semibold text-dark-700'>
                  Investment Name <span className='text-red-500'>*</span>
                </Label>
                <Input
                  id='name'
                  name='name'
                  value={formData.name}
                  onChange={handleChange}
                  placeholder='e.g., Apple Inc. Stock'
                  className={`border-light-400 ${
                    formErrors.name ? 'border-red-500' : ''
                  }`}
                />
                {formErrors.name && (
                  <p className='p-12-regular text-red-500'>{formErrors.name}</p>
                )}
              </div>

              {/* Investment Type */}
              <div className='space-y-2'>
                <Label htmlFor='type' className='p-14-semibold text-dark-700'>
                  Type <span className='text-red-500'>*</span>
                </Label>
                <Select
                  key={`type-${formData.type}`}
                  value={formData.type}
                  onValueChange={(value) => handleSelectChange('type', value)}
                >
                  <SelectTrigger
                    className={`border-light-400 ${
                      formErrors.type ? 'border-red-500' : ''
                    }`}
                  >
                    <SelectValue placeholder='Select type' />
                  </SelectTrigger>
                  <SelectContent>
                    {INVESTMENT_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formErrors.type && (
                  <p className='p-12-regular text-red-500'>{formErrors.type}</p>
                )}
              </div>

              {/* Status */}
              <div className='space-y-2'>
                <Label htmlFor='status' className='p-14-semibold text-dark-700'>
                  Status <span className='text-red-500'>*</span>
                </Label>
                <Select
                  key={`status-${formData.status}`}
                  value={formData.status}
                  onValueChange={(value) => handleSelectChange('status', value)}
                >
                  <SelectTrigger
                    className={`border-light-400 ${
                      formErrors.status ? 'border-red-500' : ''
                    }`}
                  >
                    <SelectValue placeholder='Select status' />
                  </SelectTrigger>
                  <SelectContent>
                    {INVESTMENT_STATUSES.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formErrors.status && (
                  <p className='p-12-regular text-red-500'>
                    {formErrors.status}
                  </p>
                )}
              </div>

              {/* Initial Amount */}
              <div className='space-y-2'>
                <Label
                  htmlFor='initialAmount'
                  className='p-14-semibold text-dark-700'
                >
                  Initial Amount <span className='text-red-500'>*</span>
                </Label>
                <Input
                  id='initialAmount'
                  name='initialAmount'
                  type='number'
                  step='0.01'
                  value={formData.initialAmount || ''}
                  onChange={handleNumberChange}
                  placeholder='0.00'
                  className={`border-light-400 ${
                    formErrors.initialAmount ? 'border-red-500' : ''
                  }`}
                />
                {formErrors.initialAmount && (
                  <p className='p-12-regular text-red-500'>
                    {formErrors.initialAmount}
                  </p>
                )}
              </div>

              {/* Quantity */}
              <div className='space-y-2'>
                <Label
                  htmlFor='quantity'
                  className='p-14-semibold text-dark-700'
                >
                  Quantity (Optional)
                </Label>
                <Input
                  id='quantity'
                  name='quantity'
                  type='number'
                  step='0.00000001'
                  value={formData.quantity || ''}
                  onChange={handleNumberChange}
                  placeholder='e.g., 10 shares'
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

              {/* Average Price Per Unit */}
              <div className='space-y-2'>
                <Label
                  htmlFor='averagePricePerUnit'
                  className='p-14-semibold text-dark-700'
                >
                  Average Price Per Unit (Optional)
                </Label>
                <Input
                  id='averagePricePerUnit'
                  name='averagePricePerUnit'
                  type='number'
                  step='0.00000001'
                  value={formData.averagePricePerUnit || ''}
                  onChange={handleNumberChange}
                  placeholder='e.g., 150.50'
                  className={`border-light-400 ${
                    formErrors.averagePricePerUnit ? 'border-red-500' : ''
                  }`}
                />
                {formErrors.averagePricePerUnit && (
                  <p className='p-12-regular text-red-500'>
                    {formErrors.averagePricePerUnit}
                  </p>
                )}
              </div>

              {/* Purchase Date */}
              <div className='space-y-2'>
                <Label
                  htmlFor='purchaseDate'
                  className='p-14-semibold text-dark-700'
                >
                  Purchase Date <span className='text-red-500'>*</span>
                </Label>
                <Input
                  id='purchaseDate'
                  name='purchaseDate'
                  type='date'
                  value={formData.purchaseDate}
                  onChange={handleChange}
                  className={`border-light-400 ${
                    formErrors.purchaseDate ? 'border-red-500' : ''
                  }`}
                />
                {formErrors.purchaseDate && (
                  <p className='p-12-regular text-red-500'>
                    {formErrors.purchaseDate}
                  </p>
                )}
              </div>

              {/* Broker Platform */}
              <div className='space-y-2'>
                <Label
                  htmlFor='brokerPlatform'
                  className='p-14-semibold text-dark-700'
                >
                  Broker/Platform (Optional)
                </Label>
                <Input
                  id='brokerPlatform'
                  name='brokerPlatform'
                  value={formData.brokerPlatform}
                  onChange={handleChange}
                  placeholder='e.g., Robinhood, Fidelity'
                  className='border-light-400'
                />
              </div>
            </div>

            {/* Notes */}
            <div className='space-y-2'>
              <Label htmlFor='notes' className='p-14-semibold text-dark-700'>
                Notes (Optional)
              </Label>
              <textarea
                id='notes'
                name='notes'
                value={formData.notes}
                onChange={handleChange}
                placeholder='Additional notes about this investment...'
                rows={4}
                className='w-full rounded-md border border-light-400 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500'
              />
            </div>

            {/* Action Buttons */}
            <div className='flex items-center gap-4 pt-4 border-t border-light-400'>
              <Button
                type='button'
                variant='outline'
                onClick={() => navigate('/investments')}
                disabled={updateInvestmentMutation.isPending}
                className='border-light-400'
              >
                Cancel
              </Button>
              <Button
                type='submit'
                disabled={updateInvestmentMutation.isPending}
                className='bg-primary-500 hover:bg-primary-600'
              >
                {updateInvestmentMutation.isPending ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className='mr-2 h-4 w-4' />
                    Update Investment
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
};

export default EditInvestment;
