import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateInvestment, usePortfolioSummaries } from '@/api';
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
import { INVESTMENT_TYPES } from '@/constants/appConstants';
import { Loader2, ArrowLeft, Save, Briefcase } from 'lucide-react';
import type { CreateInvestmentRequest } from '@/types';

const AddInvestment = () => {
  const navigate = useNavigate();
  const createInvestmentMutation = useCreateInvestment();
  const { data: portfoliosData } = usePortfolioSummaries();

  const portfolios = portfoliosData?.data || [];

  const defaultPortfolioId =
    portfolios.length > 0
      ? portfolios.find((p) => p.isDefault)?.id || portfolios[0].id
      : 0;

  const [formData, setFormData] = useState<CreateInvestmentRequest>({
    portfolioId: defaultPortfolioId,
    name: '',
    type: '',
    initialAmount: 0,
    currentValue: 0,
    quantity: undefined,
    purchaseDate: new Date().toISOString().split('T')[0],
    brokerPlatform: '',
    notes: '',
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

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

    if (!formData.portfolioId || formData.portfolioId === 0) {
      errors.portfolioId = 'Portfolio selection is required';
    }

    if (!formData.name || formData.name.trim().length < 2) {
      errors.name = 'Investment name must be at least 2 characters';
    }

    if (!formData.type) {
      errors.type = 'Investment type is required';
    }

    if (!formData.initialAmount || formData.initialAmount <= 0) {
      errors.initialAmount = 'Initial amount must be greater than 0';
    }

    if (!formData.currentValue || formData.currentValue < 0) {
      errors.currentValue = 'Current value must be 0 or greater';
    }

    if (formData.quantity !== undefined && formData.quantity < 0) {
      errors.quantity = 'Quantity cannot be negative';
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

  // Handle submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const submitData: CreateInvestmentRequest = {
      ...formData,
      brokerPlatform: formData.brokerPlatform?.trim() || undefined,
      notes: formData.notes?.trim() || undefined,
    };

    createInvestmentMutation.mutate(submitData, {
      onSuccess: () => {
        navigate('/investments');
      },
    });
  };

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
          <h1 className='p-32-bold text-dark-900'>Add Investment</h1>
          <p className='p-16-regular text-dark-600 mt-1'>
            Create a new investment in your portfolio
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
                  Fill in the information about your investment
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className='space-y-6'>
            {/* Portfolio Selection */}
            <div className='space-y-2'>
              <Label
                htmlFor='portfolioId'
                className='p-14-semibold text-dark-700'
              >
                Portfolio <span className='text-red-500'>*</span>
              </Label>
              <Select
                key={`portfolioId-${formData.portfolioId}`}
                value={formData.portfolioId?.toString() || ''}
                onValueChange={(value) =>
                  handleSelectChange('portfolioId', value)
                }
              >
                <SelectTrigger
                  className={`border-light-400 ${
                    formErrors.portfolioId ? 'border-red-500' : ''
                  }`}
                >
                  <SelectValue placeholder='Select a portfolio' />
                </SelectTrigger>
                <SelectContent>
                  {portfolios.map((portfolio) => (
                    <SelectItem
                      key={portfolio.id}
                      value={portfolio.id.toString()}
                    >
                      {portfolio.name}
                      {portfolio.isDefault && (
                        <span className='ml-2 text-xs text-primary-500'>
                          (Default)
                        </span>
                      )}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formErrors.portfolioId && (
                <p className='p-12-regular text-red-500'>
                  {formErrors.portfolioId}
                </p>
              )}
              <p className='p-12-regular text-dark-500'>
                Select a portfolio to organize your investments
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
                  value={formData.type || 'select'}
                  onValueChange={(value) =>
                    handleSelectChange('type', value === 'select' ? '' : value)
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
                    <SelectItem value='select' disabled>
                      Select type
                    </SelectItem>
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
                  min='0'
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

              {/* Current Value */}
              <div className='space-y-2'>
                <Label
                  htmlFor='currentValue'
                  className='p-14-semibold text-dark-700'
                >
                  Current Value <span className='text-red-500'>*</span>
                </Label>
                <Input
                  id='currentValue'
                  name='currentValue'
                  type='number'
                  step='0.01'
                  min='0'
                  value={formData.currentValue || ''}
                  onChange={handleNumberChange}
                  placeholder='0.00'
                  className={`border-light-400 ${
                    formErrors.currentValue ? 'border-red-500' : ''
                  }`}
                />
                {formErrors.currentValue && (
                  <p className='p-12-regular text-red-500'>
                    {formErrors.currentValue}
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
                  step='0.01'
                  min='0'
                  value={formData.quantity || ''}
                  onChange={handleNumberChange}
                  placeholder='Number of units'
                  className={`border-light-400 ${
                    formErrors.quantity ? 'border-red-500' : ''
                  }`}
                />
                {formErrors.quantity && (
                  <p className='p-12-regular text-red-500'>
                    {formErrors.quantity}
                  </p>
                )}
                <p className='p-12-regular text-dark-500'>
                  Number of shares, units, or coins
                </p>
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
                  max={new Date().toISOString().split('T')[0]}
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
                placeholder='e.g., Robinhood, E*TRADE, Binance'
                className='border-light-400'
              />
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
                placeholder='Add any additional notes about this investment...'
                rows={4}
                className='w-full rounded-md border border-light-400 bg-white px-3 py-2 text-sm placeholder:text-dark-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20'
              />
            </div>

            {/* Action Buttons */}
            <div className='flex flex-col-reverse gap-3 sm:flex-row sm:justify-end'>
              <Button
                type='button'
                variant='outline'
                onClick={() => navigate('/investments')}
                disabled={createInvestmentMutation.isPending}
                className='border-light-400'
              >
                Cancel
              </Button>
              <Button
                type='submit'
                disabled={createInvestmentMutation.isPending}
                className='bg-primary-500 hover:bg-primary-600 text-white'
              >
                {createInvestmentMutation.isPending ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    Creating...
                  </>
                ) : (
                  <>
                    <Save className='mr-2 h-4 w-4' />
                    Create Investment
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

export default AddInvestment;
