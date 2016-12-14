import React, { Component, } from 'react'
import { Card, } from 'material-ui/Card'
import { Grid, Cell } from 'react-mdl'

class AppointmentCard extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const {
      appointment, appointmentIndex, appointmentId, site,
    } = this.props
    const meta = appointmentIndex ? appointmentIndex.meta : null
    if (meta) {
      meta.createdAt = appointmentIndex.createdAt
    }
    let engineer = this.props.engineer
    if (!engineer && meta && meta.firstName) {
      engineer = Object.assign({}, meta)
    }
    const appointmentNumber = appointment ? appointment.legacyId :
      meta ? meta.legacyId : '...'
    const statusAndTimestamp = appointment ? this.formatStatusAndTimestamp(appointment) :
      meta ? this.formatStatusAndTimestamp(meta) : ['XXXXXX', 'YYYY']
    const engineerName = engineer ? `${engineer.firstName} ${engineer.lastName}` : 'Unassigned'
    const priority = appointment ? appointment.priority :
      meta ? meta.priority : '...'
    const type = appointment ? appointment.type :
      meta ? meta.type : '...'
    const siteName = site ? site.name :
      meta ? meta.siteName : '...'
    const siteAddress = site ? site.address.street + ', ' + site.address.city :
      meta ? meta.siteAddress : '...'

    return (
      <div style={styles.cards}>
        <Card
          style={ this.props.recentlyCreated === appointmentId ?
            styles.activeAppointmentCard : styles.appointmentCard
          }
          onClick={() => { this.props.selectAppointment(appointmentId) }}
        >
          <Grid>
            <Cell col={1}>
              { engineer ?
                <Avatar src={avatarTypes[engineer.firstName]} style={styles.techAvatar} /> :
                  <ActionAccountCircle style={styles.staticAvatar}/>
              }
            </Cell>
            <Cell col={3}>
              <div style={styles.appointmentNumber}>
                {appointmentNumber || 'Pending'}
              </div>
              <div style={styles.engineerName}>
                {engineerName}
              </div>
            </Cell>
            <Cell col={1}>
              <div style={styles.appointmentPriorityAndType}>
                {`P${priority}` || 'Appointment Priority'}
              </div>
              <div style={styles.billingType}>
                {type || 'T&M'}
              </div>
            </Cell>
            <Cell col={5}>
              <div style={styles.siteName}>
                { siteName }
              </div>
              <div style={styles.siteAddress}>
                { siteAddress }
              </div>
            </Cell>
            <Cell col={2} style={styles.status}>
              <div>
                {statusAndTimestamp[0]}
              </div>
              <div style={styles.timestamp}>
                {statusAndTimestamp[1]}
              </div>
            </Cell>
          </Grid>
        </Card>
      </div>
    )
  }
}

const styles = {
  cards: {
    marginBottom: 8,
  },
  appointmentCard: {
    cursor: 'pointer',
    paddingRight: 0,
  },
  activeAppointmentCard: {
    backgroundColor: palette.sidebarBackground,
    cursor: 'pointer',
  },
  appointmentNumber: {
    color: palette.textColor,
    fontWeight: 500,
  },
  appointmentPriorityAndType: {
    color: palette.textColor,
  },
  billingType: {
    color: palette.textColorSoft,
  },
  clientInfo: {
    color: palette.textColorSoft,
    float: 'left',
  },
  engineerName: {
    color: palette.textColorSoft,
    float: 'left',
    fontWeight: 500,
  },
  staticAvatar: {
    float: 'left',
    height: 44,
    opacity: 0.24,
    width: 44,
  },
  timestamp: {
    color: palette.textColorSoft,
  },
}

export default AppointmentCard
