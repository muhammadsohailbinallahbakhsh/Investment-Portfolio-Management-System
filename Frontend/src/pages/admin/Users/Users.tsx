import { useState, useMemo, useEffect, useCallback } from 'react';
import { PageHeader } from '../components';

//import { Pagination, PageSizeAndStatsController } from '@/components';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, Eye, Pencil, Edit } from 'lucide-react';

const ManageUsersTable = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // const totalPages = useMemo(() => {
  //   return Math.ceil(usersPageData.length / pageSize);
  // }, [pageSize]);

  // useEffect(() => {
  //   if (currentPage > totalPages && totalPages > 0) {
  //     setCurrentPage(totalPages);
  //   }
  // }, [totalPages, currentPage]);

  const handleDeleteUser = (userId: number) => {
    console.log('Delete user:', userId);
  };

  const handlePageChange = useCallback(
    (page: number) => {
      const validPage = Math.min(
        Math.max(page, 1)
        //Math.ceil(usersPageData.length / pageSize)
      );
      setCurrentPage(validPage);
    },
    [pageSize]
  );

  const handlePageSizeChange = useCallback((size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  }, []);

  // const pagedUsers = useMemo(() => {
  //   if (!usersPageData || usersPageData.length === 0) {
  //     return [];
  //   }
  //   const startIndex = Math.max(0, (currentPage - 1) * pageSize);
  //   const endIndex = Math.min(startIndex + pageSize, usersPageData.length);
  //   return usersPageData.slice(startIndex, endIndex);
  // }, [currentPage, pageSize]);

  return (
    <main className='w-full flex flex-col gap-6'>
      <PageHeader
        heading='Manage Users'
        subHeading='Filter, sort, and access detailed user profiles'
        buttonCaption='Add new user'
      />

      <div className='bg-white rounded-2xl'>
        <Card className='w-full bg-white border-0 !shadow-[var(--shadow-100)] gap-0 pt-0'>
          <div className='bg-light-100 p-4 rounded-t-xl'>
            {/* <PageSizeAndStatsController
              totalRecords={usersPageData.length}
              pageSize={pageSize}
              currentPage={currentPage}
              onPageSizeChange={handlePageSizeChange}
              className='py-1 px-2'
            /> */}
          </div>
          <Table>
            <TableHeader>
              <TableRow className='border-none'>
                {[
                  'Name',
                  'Email Address',
                  'Date Joined',
                  'Itinerary Created',
                  'Status',
                  'Actions',
                ].map((heading) => (
                  <TableHead
                    key={heading}
                    className='p-12-medium uppercase text-gray-500'
                  >
                    {heading}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* {pagedUsers.map((user, index) => (
                <TableRow
                  key={user.id}
                  className={`hover:bg-light-200 border-none ${
                    index % 2 === 0 ? ' bg-light-200' : 'bg-white'
                  }`}
                >
                  <TableCell className='flex items-center gap-3 p-4'>
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className='w-10 h-10 rounded-full object-cover'
                      />
                    ) : (
                      <div className='w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center'>
                        <span className='p-14-semibold text-white'>
                          {user.initials}
                        </span>
                      </div>
                    )}
                    <span className='p-16-medium text-dark-100'>
                      {user.name}
                    </span>
                  </TableCell>
                  <TableCell className='p-4'>
                    <span className='p-16-regular text-gray-700'>
                      {user.email}
                    </span>
                  </TableCell>
                  <TableCell className='p-4'>
                    <span className='p-16-regular text-gray-700'>
                      {user.dateJoined}
                    </span>
                  </TableCell>
                  <TableCell className='p-4'>
                    <span className='p-16-regular text-gray-700'>
                      {user.itineraryCount}
                    </span>
                  </TableCell>
                  <TableCell className='p-4'>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full p-12-medium ${
                        user.status === 'Admin'
                          ? 'bg-light-300 text-gray-700'
                          : 'bg-success-50 text-success-700'
                      }`}
                    >
                      {user.status}
                    </span>
                  </TableCell>
                  <TableCell className='p-4'>
                    <Button
                      variant='ghost'
                      size='icon'
                      onClick={() => handleDeleteUser(user.id)}
                    >
                      <Trash2 className='w-4 h-4 text-gray-400' />
                    </Button>
                    <Button
                      variant='ghost'
                      size='icon'
                      onClick={() => handleDeleteUser(user.id)}
                    >
                      <Edit className='w-4 h-4 text-gray-400' />
                    </Button>
                    <Button
                      variant='ghost'
                      size='icon'
                      onClick={() => handleDeleteUser(user.id)}
                    >
                      <Pencil className='w-4 h-4 text-gray-400' />
                    </Button>
                  </TableCell>
                </TableRow>
              ))} */}
            </TableBody>
          </Table>
        </Card>
        <div className='pagination-wrapper p-4'>
          {/* <Pagination
            totalRecords={usersPageData.length}
            pageSize={pageSize}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          /> */}
        </div>
      </div>
    </main>
  );
};

export default ManageUsersTable;
