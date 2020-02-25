import React, { useState, useEffect } from 'react';

import { FaGithubAlt, FaPlus, FaSpinner } from 'react-icons/fa';
import { Link } from 'react-router-dom';

import api from '../../services/api';

import { Form, SubmitButton, List } from './styles';
import Container from '../../components/Container';

export default function Main() {
  const [newRepo, setNewRepo] = useState('');
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const repositories = localStorage.getItem('repositories');

    if (repositories) {
      setRepos(JSON.parse(repositories));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('repositories', JSON.stringify(repos));
  }, [repos]);

  function handleInputChange(event) {
    setNewRepo(event.target.value);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setLoading(true);

    const response = await api.get(`/repos/${newRepo}`);

    setLoading(false);

    const data = {
      name: response.data.full_name,
    };

    setRepos([...repos, data]);
    setNewRepo('');
  }

  return (
    <Container>
      <h1>
        <FaGithubAlt />
        Repositórios
      </h1>

      <Form onSubmit={handleSubmit}>
        <input
          value={newRepo}
          onChange={handleInputChange}
          type="text"
          placeholder="Adicionar repositório"
        />

        <SubmitButton loading={loading}>
          {loading ? (
            <FaSpinner color="#fff" size={24} />
          ) : (
            <FaPlus color="#fff" size={24} />
          )}
        </SubmitButton>
      </Form>

      <List>
        {repos.map(repository => (
          <li>
            <span>{repository.name}</span>
            <Link to={`/repository/${encodeURIComponent(repository.name)}`}>
              Detalhes
            </Link>
          </li>
        ))}
      </List>
    </Container>
  );
}
