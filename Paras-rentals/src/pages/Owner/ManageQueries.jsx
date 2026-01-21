import React, { useEffect, useState, Fragment } from 'react'
import Title from '../../components/owner/Title'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'

const ManageQueries = () => {

  const { isOwner, axios } = useAppContext()

  const [queries, setQueries] = useState([])
  const [openRow, setOpenRow] = useState(null)

  const fetchQueries = async () => {
    try {
      const { data } = await axios.get('/api/owner/queries')
      if (data.success) {
        setQueries(data.queries)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const toggleResolved = async (id, current) => {
    try {
      const { data } = await axios.patch(`/api/owner/queries/${id}`, {
        resolved: !current
      })

      if (data.success) {
        setQueries(prev =>
          prev.map(q =>
            q._id === id ? { ...q, resolved: !current } : q
          )
        )
        toast.success('Status updated')
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const copyText = (text) => {
    navigator.clipboard.writeText(text)
    toast.success('Copied')
  }

  useEffect(() => {
    isOwner && fetchQueries()
  }, [isOwner])

  return (
    <div className='px-4 pt-10 md:px-10 w-full'>
      <Title
        title="Manage Queries"
        subTitle="View customer queries and mark them as resolved."
      />

      <div className='max-w-4xl w-full rounded-md overflow-hidden border border-borderColor mt-6'>
        <table className='w-full border-collapse text-left text-sm text-gray-600'>
          <thead className='text-gray-500'>
            <tr>
              <th className='p-3 font-medium'>Sr. No.</th>
              <th className='p-3 font-medium'>Name</th>
              <th className='p-3 font-medium'>Email</th>
              <th className='p-3 font-medium'>Phone</th>
              <th className='p-3 font-medium text-center'>Resolved</th>
              <th className='p-3 font-medium text-center'>Message</th>
            </tr>
          </thead>

          <tbody>
            {queries.map((q, index) => (
              <Fragment key={q._id}>
                <tr className='border-t border-borderColor'>
                  <td className='p-3'>{index + 1}</td>

                  <td className='p-3 font-medium'>{q.name}</td>

                  <td className='p-3'>
                    <div className='flex items-center justify-between gap-3'>
                        <span className='truncate max-w:180px'>{q.email}</span>
                        <button
                        onClick={() => copyText(q.email)}
                        className='text-xs px-2 py-1 border rounded hover:bg-gray-100 whitespace-nowrap'
                        >
                        Copy
                        </button>
                    </div>
                   </td>


                    <td className='p-3'>
                    <div className='flex items-center justify-between gap-3'>
                        <span className='font-mono'>{q.phone}</span>
                        <button
                        onClick={() => copyText(q.phone)}
                        className='text-xs px-2 py-1 border rounded hover:bg-gray-100 whitespace-nowrap'
                        >
                        Copy
                        </button>
                    </div>
                    </td>


                  <td className='p-3 text-center'>
                    <input
                      type="checkbox"
                      checked={q.resolved}
                      onChange={() => toggleResolved(q._id, q.resolved)}
                      className='cursor-pointer'
                    />
                  </td>

                  <td className='p-3 text-center'>
                    <button
                      onClick={() =>
                        setOpenRow(openRow === q._id ? null : q._id)
                      }
                      className='text-lg'
                    >
                      ⌄
                    </button>
                  </td>
                </tr>

                {openRow === q._id && (
                  <tr className='border-t border-borderColor bg-gray-50'>
                    <td colSpan="6" className='p-4 text-gray-700'>
                      <p className='font-medium mb-1'>Message</p>
                      <p className='text-sm'>{q.message}</p>
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}

            {queries.length === 0 && (
              <tr>
                <td colSpan="6" className='p-6 text-center text-gray-400'>
                  No queries found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ManageQueries
