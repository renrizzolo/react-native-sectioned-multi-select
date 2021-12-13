import * as React from 'react'
import SMSContext from './SMSContext'

export default function useSMSContext() {
  const context = React.useContext(SMSContext)
  if (context === undefined) {
    throw new Error(
      'useSMSContext must be used within SMSContext.Provider or <SectionedMultiSelect/>'
    )
  }
  return context
}
