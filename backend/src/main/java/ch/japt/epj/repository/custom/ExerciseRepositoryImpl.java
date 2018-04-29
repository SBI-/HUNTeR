package ch.japt.epj.repository.custom;

import ch.japt.epj.model.data.Exercise;
import org.hibernate.MultiIdentifierLoadAccess;
import org.hibernate.Session;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.transaction.Transactional;
import java.util.List;

public class ExerciseRepositoryImpl implements ExerciseRepositoryCustom {

    @PersistenceContext
    EntityManager manager;

    @Transactional
    @Override
    public List<Exercise> findByIds(List<Integer> ids) {
        Session session = manager.unwrap(Session.class);
        MultiIdentifierLoadAccess<Exercise> access = session.byMultipleIds(Exercise.class);
        return access.multiLoad(ids);
    }
}