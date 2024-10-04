package dbHandler

import (
	"context"

	"github.com/google/uuid"
	"mathtestr.com/server/internal/types"
)

// GETS

const QGetGameSessionByGameSessionID = `
  SELECT game_session_id, user_id, timestamp, limit_type, questions_count, correct_count, score, time, min, max, add, sub, mult, div 
  FROM game_sessions.data
  WHERE game_session_id=$1
`

func (dbHandler *DBHandler) GetGameSessionByGameSessionID(gameSessionID uuid.UUID) (types.GameSession, error) {
	var gameSession types.GameSession

	err := dbHandler.Conn.QueryRow(
		context.Background(),
		QGetGameSessionByGameSessionID,
		gameSessionID,
	).Scan(
		&gameSession.GameSessionID,
		&gameSession.UserID,
		&gameSession.Timestamp,
		&gameSession.LimitType,
		&gameSession.QuestionsCount,
		&gameSession.CorrectCount,
		&gameSession.Score,
		&gameSession.Time,
		&gameSession.Min,
		&gameSession.Max,
		&gameSession.Add,
		&gameSession.Sub,
		&gameSession.Mult,
		&gameSession.Div,
	)
	if err != nil {
		return gameSession, err
	}

	return gameSession, nil
}

const QGetAllGameSessionByUserID = `
  SELECT game_session_id, user_id, timestamp, limit_type, questions_count, correct_count, score, time, min, max, add, sub, mult, div 
  FROM game_sessions.data
  WHERE user_id=$1
	ORDER BY timestamp DESC
`

func (dbHandler *DBHandler) GetAllGameSessionsByUserID(id types.UserID) ([]types.GameSession, error) {
	sessions := []types.GameSession{}

	rows, err := dbHandler.Conn.Query(
		context.Background(),
		QGetAllGameSessionByUserID,
		id,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var session types.GameSession

		err = rows.Scan(
			&session.GameSessionID,
			&session.UserID,
			&session.Timestamp,
			&session.LimitType,
			&session.QuestionsCount,
			&session.CorrectCount,
			&session.Score,
			&session.Time,
			&session.Min,
			&session.Max,
			&session.Add,
			&session.Sub,
			&session.Mult,
			&session.Div,
		)
		if err != nil {
			return nil, err
		}

		sessions = append(sessions, session)
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return sessions, nil
}

// INSERTS
const EInsertGameSessionData = `
  INSERT INTO game_sessions.data(game_session_id, user_id, limit_type, questions_count, correct_count, score, time, min, max, add, sub, mult, div)
  VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
`

func (dbHandler *DBHandler) InsertGameSessionData(session types.GameSession) error {
	_, err := dbHandler.Conn.Exec(
		context.Background(),
		EInsertGameSessionData,
		session.GameSessionID,
		session.UserID,
		session.LimitType,
		session.QuestionsCount,
		session.CorrectCount,
		session.Score,
		session.Time,
		session.Min,
		session.Max,
		session.Add,
		session.Sub,
		session.Mult,
		session.Div,
	)
	if err != nil {
		return err
	}

	return nil
}
