import readline from 'readline';
import roomService from '../services/roomService';
import logger from './logger';

const commands = {
  help: 'list available commands',
  rooms: 'list available rooms and players',
};

export const setupCli = () => {
  const linereader = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  linereader.on('line', (input: string) => {
    switch (input.trim().toLowerCase()) {
      case 'help':
        console.log('');
        console.log('Available commands:');
        Object.entries(commands).forEach(([command, helpText]) => {
          console.log(`   ${command} -- ${helpText}`);
        });
        console.log('');
        break;
      case 'rooms':
        console.log('');
        const rooms = roomService.getRooms();
        if (!rooms || Object.keys(rooms).length === 0) {
          console.log('No rooms');
        } else {
          console.log('Rooms | Players');
          Object.entries(rooms).forEach(([roomId, room]) => {
            process.stdout.write(` ${roomId} |`)
            if (room.playerIds && room.playerIds.length > 0) {
              room.playerIds.forEach(playerId => {
                process.stdout.write(` ${playerId}`);
              });
            }
            console.log('');
          });
        }
        console.log('');
        break;
      default:
        console.log('');
        console.log('help to list available commands');
        console.log('');
        break;
    }
  })
};