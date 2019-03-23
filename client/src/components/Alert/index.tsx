import React from 'react';
import './Alert.css'

type alertType = 'Info' | 'Warning' | 'Error';

export const Alert = (props: { kind: alertType, children: any }) => (
  <div className={ 'Alert ' + props.kind } >{props.children}</div>
) 