import React, { useEffect, useState } from 'react';
import ROSLIB from 'roslib';
import { Joystick } from 'react-joystick-component'; // ジョイスティックコンポーネントをインポート
import Card from 'react-bootstrap/Card';

const CmdData = ({ ros }) => {
    const [cmdVelPublisher, setCmdVelPublisher] = useState(null);

    useEffect(() => {
        if (!ros) {
            return;
        }
        const cmdVel = new ROSLIB.Topic({
            ros: ros,
            name: '/cmd_vel',
            messageType: 'geometry_msgs/Twist',
        });
        
        setCmdVelPublisher(cmdVel);
        
        return () => {
            cmdVel.unadvertise();
            setCmdVelPublisher(null);
        };
    }, [ros]);

    // ジョイスティックからの入力に基づいてコマンドを送信
    const handleMove = (event) => {
        const linearVelocityX = event.y / 2; // ジョイスティックのY軸の位置に基づく
        const angularVelocityZ = -event.x; // ジョイスティックのX軸の位置に基づく（右左の回転）
        sendCommand(linearVelocityX, angularVelocityZ);
        console.log(linearVelocityX, angularVelocityZ);
    };

    const sendCommand = (linearVelocityX, angularVelocityZ) => {
        const cmdVel = new ROSLIB.Message({
            linear: {
                x: linearVelocityX,
                y: 0,
                z: 0,
            },
            angular: {
                x: 0,
                y: 0,
                z: angularVelocityZ,
            },
        });
            
        cmdVelPublisher && cmdVelPublisher.publish(cmdVel);
    };

    return (
        <>
            <Card className="mb-4" style={{ width: '48rem' }}>
                <Card.Body>
                    <Card.Title>Robot Controller</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">publish cmd_vel</Card.Subtitle>
                    <Card.Text>
                        <Joystick size={100} baseColor="#eee" stickColor="#ddd" move={handleMove} stop={() => sendCommand(0, 0)} />
                    </Card.Text>
                </Card.Body>
            </Card>
        </>
    );
};

export default CmdData;
