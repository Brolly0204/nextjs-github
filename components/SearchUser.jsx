import { useState, useCallback, useRef } from 'react'
import { Select, Spin } from 'antd'
import debounce from 'lodash/debounce'
import { request } from '../lib/api'

const { Option } = Select

export default function SearchUser({ onChange, value }) {
  const lastFetchIdRef = useRef(0)
  const [fetching, setFetchIng] = useState(false)
  const [options, setOptions] = useState([])

  const handleChange = value => {
    setOptions([])
    setFetchIng(false)
    onChange(value)
  }

  const fetchUser = useCallback(
    debounce(value => {
      setFetchIng(true)
      setOptions([])

      lastFetchIdRef.current += 1
      const fetchId = lastFetchIdRef.current
      request({
        url: `/search/users?q=${value}`
      }).then(resp => {
        if (fetchId !== lastFetchIdRef.current) {
          return
        }
        if (resp.status === 200 && resp.data.items) {
          const data = resp.data.items.map(user => ({
            text: user.login,
            value: user.login
          }))
          setOptions(data)
        }

        setFetchIng(false)
      })
    }, 600),
    []
  )

  return (
    <Select
      style={{ width: 200 }}
      placeholder="创建者"
      showSearch={true}
      notFoundContent={fetching ? <Spin size="small" /> : <span>nothing</span>}
      filterOption={false}
      allowClear={true}
      onSearch={fetchUser}
      onChange={handleChange}
      value={value}
    >
      {options.map(op => (
        <Option key={op.value}>{op.text}</Option>
      ))}
    </Select>
  )
}
