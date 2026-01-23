import React, { useEffect, useState, Fragment } from 'react'
import { motion } from 'framer-motion'
import Title from '../../components/owner/Title'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'
import { assets } from '../../assets/assets'
import { Copy, Search } from 'lucide-react'

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
    <div className="px-4 pt-10 md:px-10 w-full">
      <Title
        title="Manage Queries"
        subTitle="View customer queries and mark them as resolved."
      />

      <div className="relative max-w-5xl w-full mt-6 border border-borderColor rounded-md overflow-hidden">
        <div className="overflow-x-auto">

          <table className="min-w-[900px] w-full border-collapse text-left text-sm text-gray-600">

            {/* ---------- TABLE HEAD ---------- */}
            <thead className="bg-gray-100 text-gray-600">
              <tr>
                <th className="p-3 font-medium sticky left-0 z-20 bg-gray-100 border-r border-borderColor">
                  Sr. No.
                </th>
                <th className="p-3 font-medium">Name</th>
                <th className="p-3 font-medium">Email</th>
                <th className="p-3 font-medium">Phone</th>
                <th className="p-3 font-medium text-center">Resolved</th>
                <th className="p-3 font-medium text-center">Message</th>
                <th className="p-3 font-medium text-center">Delete</th>
              </tr>
            </thead>

            {/* ---------- TABLE BODY ---------- */}
            <tbody>
              {queries.map((q, index) => (
                <Fragment key={q._id}>
                  <tr
                    className={`border-t border-borderColor ${
                      q.resolved ? 'bg-green-50' : ''
                    }`}
                  >
                    {/* Sr No (FIXED) */}
                    <td className="p-3 sticky left-0 z-10 bg-white border-r border-borderColor">
                      {index + 1}
                    </td>

                    <td className="p-3 font-medium">{q.name}</td>

                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <span className="truncate max-w-[200px]">
                          {q.email}
                        </span>
                        <button
                          onClick={() => copyBookingId(booking.bookingId)}
                          className="hover:text-primary"
                          title="Copy Booking ID"
                        >
                          <Copy size={14} />
                        </button>
                      </div>
                    </td>

                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <span className="font-mono">
                          {q.phone}
                        </span>
                        <button
                          onClick={() => copyBookingId(booking.bookingId)}
                          className="hover:text-primary"
                          title="Copy Booking ID"
                        >
                          <Copy size={14} />
                        </button>
                      </div>
                    </td>

                    <td className="p-3 text-center">
                      <input
                        type="checkbox"
                        checked={q.resolved}
                        onChange={() => toggleResolved(q._id, q.resolved)}
                        className="cursor-pointer"
                      />
                    </td>

                    <td className="p-3 text-center">
                      <button
                        onClick={() =>
                          setOpenRow(openRow === q._id ? null : q._id)
                        }
                        className="text-lg transition-transform duration-200"
                        style={{
                          transform:
                            openRow === q._id
                              ? 'rotate(180deg)'
                              : 'rotate(0deg)'
                        }}
                      >
                        ⌄
                      </button>
                    </td>

                    <td className="p-3 text-center">
                      <button className="text-xl text-red-500 hover:scale-110 transition">
                        🗑
                      </button>
                    </td>
                  </tr>

                  {/* ---------- MESSAGE ROW ---------- */}
                  {openRow === q._id && (
                    <motion.tr
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      transition={{ duration: 0.25 }}
                      className="border-t border-borderColor bg-gray-50"
                    >
                      <td colSpan="7" className="p-4">
                        <p className="font-medium mb-1">Message</p>
                        <p className="text-sm text-gray-700 whitespace-pre-wrap break-words">
                          {q.message}
                        </p>
                      </td>
                    </motion.tr>
                  )}
                </Fragment>
              ))}

              {queries.length === 0 && (
                <tr>
                  <td colSpan="7" className="p-6 text-center text-gray-400">
                    No queries found
                  </td>
                </tr>
              )}
            </tbody>

          </table>
        </div>
      </div>
    </div>
  )
}

export default ManageQueries
