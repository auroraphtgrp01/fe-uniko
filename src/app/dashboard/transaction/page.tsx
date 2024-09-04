'use client'
import React from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export default function page() {
  return (
    <div className='mx-auto grid max-w-6xl grid-cols-1 gap-6 px-4 py-8 md:grid-cols-2'>
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center justify-between'>
            <span>Transaction Today</span>
            <Button variant='outline'>View all</Button>
          </CardTitle>
          <CardDescription>Overview of today`s transactions</CardDescription>
        </CardHeader>
        <CardContent className='grid gap-4'>
          <div className='flex items-center justify-between'>
            <div className='font-medium'>Total Transactions</div>
            <div className='text-2xl font-bold'>25</div>
          </div>
          <div className='flex items-center justify-between'>
            <div className='font-medium'>Total Amount</div>
            <div className='text-2xl font-bold'>$12,345.67</div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center justify-between'>
            <span>Unclassified Transaction</span>
            <Button variant='outline'>Classify</Button>
          </CardTitle>
          <CardDescription>Transactions without a tracker</CardDescription>
        </CardHeader>
        <CardContent className='grid gap-4'>
          <div className='flex items-center justify-between'>
            <div className='font-medium'>Total Transactions</div>
            <div className='text-2xl font-bold'>7</div>
          </div>
          <div className='flex items-center justify-between'>
            <div className='font-medium'>Total Amount</div>
            <div className='text-2xl font-bold'>$1,234.56</div>
          </div>
        </CardContent>
      </Card>
      <div className='col-span-2'>
        <Card>
          <CardHeader>
            <CardTitle>Transactions</CardTitle>
            <CardDescription>All financial transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='mx-auto max-w-6xl px-4 py-8'>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Task</TableHead>
                    <TableHead>Assignee</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Point</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Progress</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {/* {tasks.map((task, index) => (
                    <TableRow key={index}>
                      <TableCell>{task.name}</TableCell>
                      <TableCell>{task.assignee}</TableCell>
                      <TableCell>{task.type}</TableCell>
                      <TableCell>{task.priority}</TableCell>
                      <TableCell>{task.point}</TableCell>
                      <TableCell>{task.dueDate}</TableCell>
                      <TableCell>
                        <Progress value={task.progress} />
                      </TableCell>
                    </TableRow>
                  ))} */}
                </TableBody>
              </Table>
              <div className='mt-4'>
                <button className='text-blue-500'>+ Create new task</button>
              </div>
            </div>
            {/* <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>#</TableHead>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Direction</TableHead>
                  <TableHead>Currency</TableHead>
                  <TableHead>Account Bank</TableHead>
                  <TableHead>Tracker Transaction</TableHead>
                  <TableHead>Created At</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>1</TableCell>
                  <TableCell>TX123456</TableCell>
                  <TableCell>$500.00</TableCell>
                  <TableCell>Debit</TableCell>
                  <TableCell>USD</TableCell>
                  <TableCell>Bank of America</TableCell>
                  <TableCell className="text-green-500">Rent Payment</TableCell>
                  <TableCell>2023-05-01</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>2</TableCell>
                  <TableCell>TX789012</TableCell>
                  <TableCell>$75.00</TableCell>
                  <TableCell>Credit</TableCell>
                  <TableCell>USD</TableCell>
                  <TableCell>Chase Bank</TableCell>
                  <TableCell className="text-green-500">Paycheck</TableCell>
                  <TableCell>2023-05-02</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>3</TableCell>
                  <TableCell>TX345678</TableCell>
                  <TableCell>$25.00</TableCell>
                  <TableCell>Debit</TableCell>
                  <TableCell>USD</TableCell>
                  <TableCell>Wells Fargo</TableCell>
                  <TableCell className="text-green-500">Grocery</TableCell>
                  <TableCell>2023-05-03</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>4</TableCell>
                  <TableCell>TX901234</TableCell>
                  <TableCell>$150.00</TableCell>
                  <TableCell>Debit</TableCell>
                  <TableCell>USD</TableCell>
                  <TableCell>Bank of America</TableCell>
                  <TableCell>Unclassified</TableCell>
                  <TableCell>2023-05-04</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>5</TableCell>
                  <TableCell>TX567890</TableCell>
                  <TableCell>$80.00</TableCell>
                  <TableCell>Credit</TableCell>
                  <TableCell>USD</TableCell>
                  <TableCell>Chase Bank</TableCell>
                  <TableCell>Unclassified</TableCell>
                  <TableCell>2023-05-05</TableCell>
                </TableRow>
              </TableBody>
            </Table> */}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
