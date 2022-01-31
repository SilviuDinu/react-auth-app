import axios from 'axios';
import { useRef } from 'react';
import { useState, useEffect } from 'react';
import { Redirect, useHistory } from 'react-router-dom';
import { useToken } from '../auth/useToken';
import { useUser } from '../auth/useUser';
import { useQueryParams } from '../util/useQueryParams';

export const AcceptExpenseSharingPage = () => {
  const queryParams = useQueryParams();
  const history = useHistory();
  const [sharingAccepted, setSharingAccepted] = useState(false);
  const [sharingDeclined, setSharingDeclined] = useState(false);
  const user = useUser();
  const [token] = useToken();

  const { id, info, email, isVerified } = user;

  const [getSharedByFailed, setGetSharedByFailed] = useState();
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [sharedBy, setSharedBy] = useState(null);
  const [addedToTrusted, setAddedToTrused] = useState(null);
  const [isTrustedUser, setIsTrustedUser] = useState(false);
  const sharedByIdRef = useRef();

  useEffect(() => {
    const getSharedBy = async () => {
      try {
        const response = await axios.get(`/api/expenses/${id}/get-shared-by/${queryParams.sharingCode}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response && response.data) {
          const { isTrustedUser: isTrustedUserValue, sharedBy: sharedByValue, sharedById } = response.data;
          sharedByIdRef.current = sharedById;
          setSharedBy(sharedByValue);
          setIsTrustedUser(isTrustedUserValue);
          setGetSharedByFailed(false);
        }
      } catch (err) {
        setGetSharedByFailed(true);
      }
    };

    if (!sharedBy) {
      getSharedBy();
    }
  }, [sharedBy]);

  const goToDashboard = () => {
    setTimeout(() => history.replace({ pathname: '/dashboard' }), 3000);
  };

  useEffect(() => {
    console.log(queryParams);
    if (showSuccessMessage || showErrorMessage) {
      setTimeout(() => {
        setShowSuccessMessage(false);
        setShowErrorMessage(false);
      }, 3000);
    }
  }, [showSuccessMessage, showErrorMessage]);

  const acceptSharing = async () => {
    try {
      const response = await axios.put(
        `/api/expenses/${id}/accept-expense-sharing/${queryParams.sharingCode}`,
        {
          expenseId: queryParams.expenseId,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSharingAccepted(true);
      setShowSuccessMessage(true);
      setSharingDeclined(false);
    } catch (err) {
      setSharingAccepted(false);
      setShowErrorMessage(true);
      setSharingDeclined(false);
      setErrorMessage(err.message);
    }
  };

  const declineSharing = async () => {
    try {
      await axios.put(
        `/api/expenses/${id}/decline-expense-sharing/${queryParams.sharingCode}`,
        {
          expenseId: queryParams.expenseId,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSharingAccepted(false);
      setSharingDeclined(true);
      setShowSuccessMessage(true);
      goToDashboard();
    } catch (err) {
      setSharingAccepted(false);
      setSharingDeclined(false);
      setShowErrorMessage(true);
      setErrorMessage(err.message);
    }
  };

  const addToTrusted = async () => {
    try {
      await axios.put(
        `/api/users/${id}/add-trusted-user/`,
        {
          userName: sharedBy,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setAddedToTrused(true);
      setShowSuccessMessage(true);
      goToDashboard();
    } catch (err) {
      setShowErrorMessage(true);
      setErrorMessage(err.message);
    }
  };

  if (getSharedByFailed === undefined) {
    return <h1>Loading...</h1>;
  }

  if (getSharedByFailed) {
    return <h1>The url is no longer valid or something went wrong</h1>;
  }

  if (sharedByIdRef.current === id || !queryParams.sharedBy || !queryParams.expenseId) {
    return <Redirect to="/dashboard" />;
  }

  return (
    <div className="content-container">
      {showSuccessMessage && <div className="success">Action successful!</div>}
      {showErrorMessage && (
        <div className="fail">{errorMessage || "Uh oh... something went wrong and we couldn't save changes"}</div>
      )}
      {!sharingAccepted && !sharingDeclined && (
        <>
          <p>{queryParams.sharedBy} wants to share an expense with you</p>
          <button onClick={acceptSharing}>Accept</button>
          <button onClick={declineSharing}>Decline</button>
        </>
      )}

      {sharingAccepted && !isTrustedUser && (
        <>
          <p>Add {queryParams.sharedBy} to your trusted contacts?</p>
          <p>This would allow them to share expenses with you without you having to approve each one via email.</p>
          <button onClick={addToTrusted}>Add {queryParams.sharedBy}</button>
          <button
            onClick={() => {
              setAddedToTrused(false);
              history.replace('/dashboard');
            }}>
            No thanks
          </button>
        </>
      )}
    </div>
  );
};
