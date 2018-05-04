package ch.japt.epj.model.data;


import javax.persistence.*;
import java.util.ArrayList;
import java.util.Collection;

@Entity
public class Exercise {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long exerciseId;

    private String name;

    @OneToOne
    private Location location;

    @OneToMany
    private Collection<Answer> answerTemplates = new ArrayList<>();

    @OneToMany
    private Collection<Response> responses = new ArrayList<>();

    private String question;


    public void addAnswerTemplate(Answer answerTemplate) {
        answerTemplates.add(answerTemplate);
    }

    public void removeAnswerTemplate(Answer answerTemplate) {
        answerTemplates.remove(answerTemplate);
    }

    public Collection<Answer> getAnswerTemplates() {
        return answerTemplates;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Location getLocation() {
        return location;
    }

    public void setLocation(Location location) {
        this.location = location;
    }

    public long getExerciseId() {
        return exerciseId;
    }

    public String getQuestion() {
        return question;
    }

    public void setQuestion(String question) {
        this.question = question;
    }
}
