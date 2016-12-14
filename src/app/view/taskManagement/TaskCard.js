import React, { Component, } from 'react'
import { Card, } from 'material-ui/Card'
import { palette } from '../../theme/Theme'
import avatarTypes from '../../const/avatarTypes'
import { Avatar, } from 'material-ui'
import ActionAccountCircle from 'material-ui/svg-icons/action/account-circle'
import appointmentStatus from '../../const/appointmentStatus'
import moment from 'moment'
import { Grid, Cell } from 'react-mdl'

class AppointmentCard extends Component {
  constructor(props) {
    super(props)
  }

  shouldComponentUpdate(nextProps, nextState) {
    const response = (
      JSON.stringify(this.props.appointment) !== JSON.stringify(nextProps.appointment) ||
      JSON.stringify(this.props.recentlyCreated) !== JSON.stringify(nextProps.recentlyCreated) ||
      JSON.stringify(this.props.site) !== JSON.stringify(nextProps.site)
    )
    if (response) {
      this.checkForRecentlyCreated()
    }
    return response
  }

  checkForRecentlyCreated() {
    if (
      this.props.recentlyCreated === this.props.appointmentId &&
      !this.recentlyCreatedTimeout
    ) {
      this.recentlyCreatedTimeout = setTimeout(() => {
        this.props.clearRecentlyCreated()
        this.recentlyCreatedTimeout = null
      }, 10000)
    }
  }

  formatTimePassed(timestamp) {
    let passed = Math.floor((Date.now() - timestamp) / 1000)
    let formatted = ''
    if (passed >= 86400) {
      let days = Math.floor(passed / 86400)
      passed = passed - (days * 86400)
      formatted = formatted + days + ' days '
    }
    if (passed >= 3600) {
      let hours = Math.floor(passed / 3600)
      passed = passed - (hours * 3600)
      formatted = formatted + hours + ' hours '
    }
    if (passed >= 60) {
      let minutes = Math.floor(passed / 60)
      passed = passed - (minutes * 60)
      formatted = formatted + minutes + ' minutes '
    }
    formatted = formatted + passed + ' seconds '
    return formatted
  }

  formatStatusAndTimestamp(appointment) {
    let formatted = []
    switch (appointment.status) {
      case appointmentStatus.UNASSIGNED:
        formatted = ['Created', moment(appointment.createdAt).fromNow()]
        break
      case appointmentStatus.ASSIGNED:
        formatted = ['Assigned', moment(appointment.assignedAt).fromNow()]
        break
      case appointmentStatus.APPROACHING:
        formatted = ['Started driving', moment(appointment.departedAt).fromNow()]
        break
      case appointmentStatus.ARRIVED:
        formatted = ['Arrived', moment(appointment.arrivedAt).fromNow()]
        break
      case appointmentStatus.COMPLETED:
        formatted = ['Work Order Submitted', moment(appointment.completedAt).fromNow()]
        break
    }
    return formatted
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
