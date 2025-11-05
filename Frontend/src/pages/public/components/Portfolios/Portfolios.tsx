import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  usePortfolios,
  useCreatePortfolio,
  useUpdatePortfolio,
  useDeletePortfolio,
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Loader2,
  Plus,
  TrendingUp,
  TrendingDown,
  Edit,
  Trash2,
  Eye,
  Briefcase,
  DollarSign,
  BarChart3,
} from 'lucide-react';
import type {
  Portfolio,
  CreatePortfolioRequest,
  UpdatePortfolioRequest,
} from '@/types';

const Portfolios = () => {
  const navigate = useNavigate();
  const { data: portfoliosData, isLoading } = usePortfolios();
  const createPortfolioMutation = useCreatePortfolio();
  const updatePortfolioMutation = useUpdatePortfolio();
  const deletePortfolioMutation = useDeletePortfolio();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedPortfolio, setSelectedPortfolio] = useState<Portfolio | null>(
    null
  );

  const [createForm, setCreateForm] = useState<CreatePortfolioRequest>({
    name: '',
    description: '',
  });

  const [editForm, setEditForm] = useState<UpdatePortfolioRequest>({
    name: '',
    description: '',
  });

  const [formErrors, setFormErrors] = useState<{
    name?: string;
    description?: string;
  }>({});

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const errors: typeof formErrors = {};
    if (!createForm.name || createForm.name.trim().length < 2) {
      errors.name = 'Portfolio name must be at least 2 characters';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    createPortfolioMutation.mutate(createForm, {
      onSuccess: () => {
        setIsCreateModalOpen(false);
        setCreateForm({ name: '', description: '' });
        setFormErrors({});
      },
    });
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedPortfolio) return;

    const errors: typeof formErrors = {};
    if (editForm.name && editForm.name.trim().length < 2) {
      errors.name = 'Portfolio name must be at least 2 characters';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    updatePortfolioMutation.mutate(
      {
        id: selectedPortfolio.id,
        data: editForm,
      },
      {
        onSuccess: () => {
          setIsEditModalOpen(false);
          setSelectedPortfolio(null);
          setEditForm({ name: '', description: '' });
          setFormErrors({});
        },
      }
    );
  };

  const handleDeleteConfirm = () => {
    if (!selectedPortfolio) return;

    deletePortfolioMutation.mutate(selectedPortfolio.id, {
      onSuccess: () => {
        setIsDeleteModalOpen(false);
        setSelectedPortfolio(null);
      },
    });
  };

  const openEditModal = (portfolio: Portfolio) => {
    setSelectedPortfolio(portfolio);
    setEditForm({
      name: portfolio.name,
      description: portfolio.description || '',
    });
    setFormErrors({});
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (portfolio: Portfolio) => {
    setSelectedPortfolio(portfolio);
    setIsDeleteModalOpen(true);
  };

  const calculateGainLoss = (portfolio: Portfolio) => {
    const gainLoss = portfolio.currentValue - portfolio.totalInvested;
    const gainLossPercentage =
      portfolio.totalInvested > 0
        ? (gainLoss / portfolio.totalInvested) * 100
        : 0;
    return { gainLoss, gainLossPercentage };
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <Loader2 className='w-8 h-8 animate-spin text-primary-100' />
      </div>
    );
  }

  const portfolios = portfoliosData?.data?.data || [];

  return (
    <div className='w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
        <div>
          <h1 className='p-32-bold text-dark-100'>My Portfolios</h1>
          <p className='p-16-regular text-gray-500 mt-1'>
            Manage and track your investment portfolios
          </p>
        </div>
        <Button
          onClick={() => {
            setCreateForm({ name: '', description: '' });
            setFormErrors({});
            setIsCreateModalOpen(true);
          }}
          className='bg-primary-100 hover:bg-primary-500 text-white'
        >
          <Plus className='w-4 h-4 mr-2' />
          Create Portfolio
        </Button>
      </div>

      {/* Portfolios Grid */}
      {portfolios.length === 0 ? (
        <Card className='shadow-100 border-light-400'>
          <CardContent className='flex flex-col items-center justify-center py-12'>
            <Briefcase className='w-16 h-16 text-gray-200 mb-4' />
            <h3 className='p-20-semibold text-dark-100 mb-2'>
              No Portfolios Yet
            </h3>
            <p className='p-14-regular text-gray-500 text-center max-w-md mb-6'>
              Create your first portfolio to start tracking your investments and
              monitor performance.
            </p>
            <Button
              onClick={() => setIsCreateModalOpen(true)}
              className='bg-primary-100 hover:bg-primary-500 text-white'
            >
              <Plus className='w-4 h-4 mr-2' />
              Create Your First Portfolio
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {portfolios.map((portfolio: Portfolio) => {
            const { gainLoss, gainLossPercentage } =
              calculateGainLoss(portfolio);
            const isPositive = gainLoss >= 0;

            return (
              <Card
                key={portfolio.id}
                className='shadow-100 border-light-400 hover:shadow-200 transition-shadow cursor-pointer'
              >
                <CardHeader className='bg-light-300 pb-4'>
                  <div className='flex items-start justify-between'>
                    <div className='flex-1'>
                      <CardTitle className='p-18-bold text-dark-100 line-clamp-1'>
                        {portfolio.name}
                      </CardTitle>
                      {portfolio.description && (
                        <CardDescription className='p-14-regular text-gray-500 mt-1 line-clamp-2'>
                          {portfolio.description}
                        </CardDescription>
                      )}
                    </div>
                    <Briefcase className='w-5 h-5 text-primary-100 ml-2' />
                  </div>
                </CardHeader>
                <CardContent className='pt-6 space-y-4'>
                  {/* Current Value */}
                  <div>
                    <p className='p-12-medium text-gray-500 uppercase tracking-wide mb-1'>
                      Current Value
                    </p>
                    <p className='p-24-bold text-dark-100'>
                      {formatCurrency(portfolio.currentValue)}
                    </p>
                  </div>

                  {/* Performance */}
                  <div className='flex items-center justify-between p-3 rounded-lg bg-light-300'>
                    <div className='flex items-center gap-2'>
                      {isPositive ? (
                        <TrendingUp className='w-5 h-5 text-success-500' />
                      ) : (
                        <TrendingDown className='w-5 h-5 text-red-500' />
                      )}
                      <div>
                        <p className='p-12-medium text-gray-500'>Gain/Loss</p>
                        <p
                          className={`p-16-semibold ${
                            isPositive ? 'text-success-700' : 'text-red-500'
                          }`}
                        >
                          {formatCurrency(Math.abs(gainLoss))}
                        </p>
                      </div>
                    </div>
                    <div className='text-right'>
                      <p
                        className={`p-18-bold ${
                          isPositive ? 'text-success-700' : 'text-red-500'
                        }`}
                      >
                        {isPositive ? '+' : ''}
                        {gainLossPercentage.toFixed(2)}%
                      </p>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className='grid grid-cols-2 gap-4 pt-2'>
                    <div>
                      <p className='p-12-medium text-gray-500 uppercase tracking-wide mb-1'>
                        Invested
                      </p>
                      <p className='p-16-semibold text-dark-100'>
                        {formatCurrency(portfolio.totalInvested)}
                      </p>
                    </div>
                    <div>
                      <p className='p-12-medium text-gray-500 uppercase tracking-wide mb-1'>
                        Investments
                      </p>
                      <p className='p-16-semibold text-dark-100'>
                        {portfolio.totalInvestments}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className='flex items-center gap-2 pt-4 border-t border-light-400'>
                    <Button
                      onClick={() => navigate(`/portfolios/${portfolio.id}`)}
                      variant='outline'
                      size='sm'
                      className='flex-1 border-primary-100 text-primary-100 hover:bg-primary-50'
                    >
                      <Eye className='w-4 h-4 mr-1' />
                      View
                    </Button>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        openEditModal(portfolio);
                      }}
                      variant='outline'
                      size='sm'
                      className='border-gray-200 hover:bg-light-300'
                    >
                      <Edit className='w-4 h-4' />
                    </Button>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        openDeleteModal(portfolio);
                      }}
                      variant='outline'
                      size='sm'
                      className='border-red-100 text-red-500 hover:bg-red-50'
                    >
                      <Trash2 className='w-4 h-4' />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Create Portfolio Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className='sm:max-w-[500px]'>
          <DialogHeader>
            <DialogTitle className='p-24-bold text-dark-100 flex items-center gap-2'>
              <Plus className='w-6 h-6 text-primary-100' />
              Create New Portfolio
            </DialogTitle>
            <DialogDescription className='p-14-regular text-gray-500'>
              Create a new portfolio to organize your investments
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateSubmit} className='space-y-4 py-4'>
            {/* Portfolio Name */}
            <div className='space-y-2'>
              <Label
                htmlFor='create-name'
                className='p-14-semibold text-dark-100'
              >
                Portfolio Name <span className='text-red-500'>*</span>
              </Label>
              <Input
                id='create-name'
                value={createForm.name}
                onChange={(e) => {
                  setCreateForm({ ...createForm, name: e.target.value });
                  setFormErrors({ ...formErrors, name: undefined });
                }}
                className={`border-light-400 focus:border-primary-100 focus:ring-primary-100 ${
                  formErrors.name ? 'border-red-500' : ''
                }`}
                placeholder='e.g., Retirement Fund, Tech Stocks'
                required
              />
              {formErrors.name && (
                <p className='text-sm text-red-500'>{formErrors.name}</p>
              )}
            </div>

            {/* Description */}
            <div className='space-y-2'>
              <Label
                htmlFor='create-description'
                className='p-14-semibold text-dark-100'
              >
                Description <span className='text-gray-400'>(Optional)</span>
              </Label>
              <Input
                id='create-description'
                value={createForm.description}
                onChange={(e) =>
                  setCreateForm({ ...createForm, description: e.target.value })
                }
                className='border-light-400 focus:border-primary-100 focus:ring-primary-100'
                placeholder='Brief description of this portfolio'
              />
            </div>

            <DialogFooter className='pt-4'>
              <Button
                type='button'
                variant='outline'
                onClick={() => setIsCreateModalOpen(false)}
                className='border-gray-200'
              >
                Cancel
              </Button>
              <Button
                type='submit'
                disabled={createPortfolioMutation.isPending}
                className='bg-primary-100 hover:bg-primary-500 text-white'
              >
                {createPortfolioMutation.isPending ? (
                  <>
                    <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className='w-4 h-4 mr-2' />
                    Create Portfolio
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Portfolio Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className='sm:max-w-[500px]'>
          <DialogHeader>
            <DialogTitle className='p-24-bold text-dark-100 flex items-center gap-2'>
              <Edit className='w-6 h-6 text-primary-100' />
              Edit Portfolio
            </DialogTitle>
            <DialogDescription className='p-14-regular text-gray-500'>
              Update your portfolio information
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className='space-y-4 py-4'>
            {/* Portfolio Name */}
            <div className='space-y-2'>
              <Label
                htmlFor='edit-name'
                className='p-14-semibold text-dark-100'
              >
                Portfolio Name
              </Label>
              <Input
                id='edit-name'
                value={editForm.name}
                onChange={(e) => {
                  setEditForm({ ...editForm, name: e.target.value });
                  setFormErrors({ ...formErrors, name: undefined });
                }}
                className={`border-light-400 focus:border-primary-100 focus:ring-primary-100 ${
                  formErrors.name ? 'border-red-500' : ''
                }`}
                placeholder='Portfolio name'
              />
              {formErrors.name && (
                <p className='text-sm text-red-500'>{formErrors.name}</p>
              )}
            </div>

            {/* Description */}
            <div className='space-y-2'>
              <Label
                htmlFor='edit-description'
                className='p-14-semibold text-dark-100'
              >
                Description <span className='text-gray-400'>(Optional)</span>
              </Label>
              <Input
                id='edit-description'
                value={editForm.description}
                onChange={(e) =>
                  setEditForm({ ...editForm, description: e.target.value })
                }
                className='border-light-400 focus:border-primary-100 focus:ring-primary-100'
                placeholder='Brief description'
              />
            </div>

            <DialogFooter className='pt-4'>
              <Button
                type='button'
                variant='outline'
                onClick={() => setIsEditModalOpen(false)}
                className='border-gray-200'
              >
                Cancel
              </Button>
              <Button
                type='submit'
                disabled={updatePortfolioMutation.isPending}
                className='bg-primary-100 hover:bg-primary-500 text-white'
              >
                {updatePortfolioMutation.isPending ? (
                  <>
                    <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                    Updating...
                  </>
                ) : (
                  <>
                    <Edit className='w-4 h-4 mr-2' />
                    Update Portfolio
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Portfolio Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className='sm:max-w-[450px]'>
          <DialogHeader>
            <DialogTitle className='p-24-bold text-red-500 flex items-center gap-2'>
              <Trash2 className='w-6 h-6' />
              Delete Portfolio
            </DialogTitle>
            <DialogDescription className='p-14-regular text-gray-500'>
              This action cannot be undone. The portfolio can only be deleted if
              it has no investments.
            </DialogDescription>
          </DialogHeader>
          <div className='py-4'>
            <p className='p-16-regular text-dark-100'>
              Are you sure you want to delete{' '}
              <span className='font-semibold'>{selectedPortfolio?.name}</span>?
            </p>
            {selectedPortfolio && selectedPortfolio.totalInvestments > 0 && (
              <div className='mt-4 p-3 bg-red-50 border border-red-100 rounded-lg'>
                <p className='p-14-semibold text-red-500'>
                  ⚠️ This portfolio has {selectedPortfolio.totalInvestments}{' '}
                  investment(s). Please remove all investments before deleting.
                </p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              type='button'
              variant='outline'
              onClick={() => setIsDeleteModalOpen(false)}
              className='border-gray-200'
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteConfirm}
              disabled={
                deletePortfolioMutation.isPending ||
                (selectedPortfolio?.totalInvestments ?? 0) > 0
              }
              className='bg-red-500 hover:bg-red-600 text-white'
            >
              {deletePortfolioMutation.isPending ? (
                <>
                  <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className='w-4 h-4 mr-2' />
                  Delete Portfolio
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Portfolios;
