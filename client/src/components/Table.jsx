import React from 'react'

const data = [
  { product: "milk", count: 5 },
  { product: "clothes", count: 10 }
]

const Table = (props) => {
  return (
    <div className="mx-4">
      <table>
        <tr>
          <th style={{ width: 200, backgroundColor: "#009ad9" }}>
            <span style={{ color: 'white' }}>Product</span>

          </th>
          <th style={{ width: 70, backgroundColor: "#009ad9", textAlign: "right" }}>   <span style={{ color: 'white' }}>Count</span></th>
        </tr>
        {
          props.numeric.map((val, idx) => {
            return (
              <tr key={idx}>
                <td style={{
                  width: 200,  
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis"
                }}>
                  <span style={{ textAlign: "left", }}> {val.product}</span>
                </td>
                <td style={{ width: 70, alignItems: "center", textAlign: "right" }}>
                  <span style={{}}> {val.count}</span>
                </td>
              </tr>
            )
          })
        }
      </table>
    </div>

  )
}

export default Table