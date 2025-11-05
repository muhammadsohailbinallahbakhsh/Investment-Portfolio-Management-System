import { useState } from 'react';
import { PageHeader } from '../components';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Activity, User, FileText } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import api from '@/api/api';
import { formatDateTime } from '@/utils';

interface ActivityLog {
  id: number;
  userId: string;
  userName: string;
  userEmail: string;
  action: string;
  entityType: string;
  entityId: string;
  details: string;
  createdAt: string;
}

interface ApiResponse {
  success: boolean;
  data: ActivityLog[];
  message: string;
}

const ActivityLogs = () => {
  const [count] = useState(50);

  const { data, isLoading, isError, error } = useQuery<ApiResponse>({
    queryKey: ['activity-logs', count],
    queryFn: async () => {
      const response = await api.get<ApiResponse>(
        `/api/activity-logs/recent?count=${count}`
      );
      return response.data;
    },
  });

  const getActionColor = (action: string) => {
    switch (action.toLowerCase()) {
      case 'create':
      case 'created':
        return 'bg-green-100 text-green-800';
      case 'update':
      case 'updated':
        return 'bg-blue-100 text-blue-800';
      case 'delete':
      case 'deleted':
        return 'bg-red-100 text-red-800';
      case 'view':
      case 'viewed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-purple-100 text-purple-800';
    }
  };

  const getEntityIcon = (entityType: string) => {
    switch (entityType.toLowerCase()) {
      case 'user':
        return <User className='h-4 w-4' />;
      case 'portfolio':
        return <FileText className='h-4 w-4' />;
      case 'investment':
        return <Activity className='h-4 w-4' />;
      default:
        return <Activity className='h-4 w-4' />;
    }
  };

  return (
    <main className='w-full flex flex-col gap-6 items-start justify-start'>
      <PageHeader
        subHeading='Track all system activities and user actions'
        heading='Activity Logs'
      />

      <Card className='w-full'>
        {isLoading && (
          <div className='flex items-center justify-center py-8'>
            <Loader2 className='w-8 h-8 animate-spin text-primary-100' />
          </div>
        )}

        {isError && (
          <div className='flex items-center justify-center py-8 text-red-600'>
            <p>
              Error loading activity logs:{' '}
              {error instanceof Error ? error.message : 'Unknown error'}
            </p>
          </div>
        )}

        {!isLoading && !isError && data?.data && (
          <div className='overflow-x-auto'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className='w-[180px]'>Date & Time</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Entity</TableHead>
                  <TableHead>Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.data.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className='text-center py-8 text-gray-500'
                    >
                      No activity logs found
                    </TableCell>
                  </TableRow>
                ) : (
                  data.data.map((log: ActivityLog) => (
                    <TableRow key={log.id}>
                      <TableCell className='font-mono text-sm'>
                        {formatDateTime(log.createdAt)}
                      </TableCell>
                      <TableCell>
                        <div className='flex flex-col'>
                          <span className='font-medium text-sm'>
                            {log.userName}
                          </span>
                          <span className='text-xs text-gray-500'>
                            {log.userEmail}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getActionColor(log.action)}>
                          {log.action}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className='flex items-center gap-2'>
                          {getEntityIcon(log.entityType)}
                          <span className='text-sm'>{log.entityType}</span>
                        </div>
                      </TableCell>
                      <TableCell className='max-w-md'>
                        <p
                          className='text-sm text-gray-700 truncate'
                          title={log.details}
                        >
                          {log.details || '—'}
                        </p>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>
    </main>
  );
};

export default ActivityLogs;
