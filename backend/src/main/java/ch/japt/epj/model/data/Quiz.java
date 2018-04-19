package ch.japt.epj.model.data;


import javax.persistence.*;
import java.util.ArrayList;
import java.util.Collection;

@Entity
public class Quiz {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long quizId;

    private String name;

    @OneToMany
    private Collection<Execution> executions = new ArrayList<>();

    @OneToMany
    private Collection<Exercise> exercises = new ArrayList<>();

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void addExecution(Execution execution){
        executions.add(execution);
    }

    public void removeExecution(Execution execution){
        executions.remove(execution);
    }

    public void addTask(Exercise exercise){
        exercises.add(exercise);
    }

    public void removeTask(Exercise exercise){
        exercises.remove(exercise);
    }

    public long getQuizId() {
        return quizId;
    }
}